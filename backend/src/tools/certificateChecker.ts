import tls from 'tls'
import { TLSSocket } from "node:tls"
import { SubjectAltName, CertificateResult, UrlParseResult, CertificateChain } from "./interface"
import _ from 'lodash'
import logger from './logger'

/**
 *  驗證 URL 格式
 */
function isValidURL(urlString: string) {
    try {
        new URL(urlString)
        return true
    } catch (error) {
        return false
    }
}

/**
 *  解析並驗證 URL
 */
function parseAndValidateUrl(urlString: string): UrlParseResult {
    try {
        if (!isValidURL(urlString)) {
            const error = new Error('非網址格式')
            logger.error(`${error.message}：${urlString}`)
            throw error
        }

        const parsedUrl = new URL(urlString)
        
        if (parsedUrl.protocol !== 'https:') {
            const error = new Error('只支援 HTTPS 網站')
            logger.error(`${error.message}：${urlString}`)
            throw error
        }

        return {
            hostname: parsedUrl.hostname,
            port: parseInt(parsedUrl.port) || 443
        }
    } catch (error: any) {
        // 區分是否為 URL 構造錯誤
        if (error instanceof TypeError) {
            const newError = new Error('非網址格式')
            logger.error(`${newError.message}：${urlString}`)
            throw newError
        }
        
        // 其他錯誤直接往上拋
        logger.error(`解析網址時發生錯誤：${error.message}`)
        throw error
    }
}

/**
 * 使用 TLS 模塊檢查憑證資訊
 */
function getTLSCertificateInfo(hostname: string, port: number = 443, timeout: number = 10000): Promise<any> {
    return new Promise((resolve, reject) => {
        let socket: TLSSocket | null = null
        let isResolved = false

        // 建立逾時處理
        const timeoutId = setTimeout(() => {
            if (!isResolved && socket) {
                isResolved = true
                console.error(`連接到 ${hostname} 逾時`)
                socket.destroy()
                reject(new Error('連接逾時'))
            }
        }, timeout)

        try {
            socket = tls.connect({
                host: hostname,
                port: port,
                rejectUnauthorized: false,
                servername: hostname,
                timeout: timeout
            })

            socket.on('secureConnect', () => {
                if (isResolved) return

                try {
                    clearTimeout(timeoutId)

                    // 取得憑證資訊
                    const cert = socket!.getPeerCertificate(true)
                    const cipher = socket!.getCipher()
                    const protocol = socket!.getProtocol()
                    const ephemeralKeyInfo = socket!.getEphemeralKeyInfo()

                    if (_.isEmpty(cert)) {
                        socket!.destroy()
                        isResolved = true
                        return reject(new Error('無法獲取憑證資訊'))
                    }

                    // 計算日期相關資訊
                    const now = new Date().getTime()
                    const validFrom = new Date(cert.valid_from).getTime()
                    const validTo = new Date(cert.valid_to).getTime()
                    const daysUntilExpiry = Math.floor((validTo - now) / (1000 * 60 * 60 * 24))
                    const totalValidDays = Math.floor((validTo - validFrom) / (1000 * 60 * 60 * 24))

                    // 憑證狀態判斷
                    const isValid = now >= validFrom && now <= validTo
                    const isExpired = now > validTo
                    const isNotYetValid = now < validFrom
                    const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0

                    // 解析主體別名
                    const parseSubjectAltName = (san: string | undefined): SubjectAltName[] => {
                        if (!san) return []
                        try {
                            return _.map(san.split(', '), item => {
                                const [type, value] = item.split(':')
                                return { type: type || '', value: value || '' }
                            })
                        } catch {
                            return []
                        }
                    }

                    const result = {
                        success: true,
                        url: `https://${hostname}`,
                        validFrom: cert.valid_from,
                        validTo: cert.valid_to,
                        isValid: isValid
                    }

                    socket!.destroy()
                    isResolved = true
                    resolve(result)

                } catch (error) {
                    clearTimeout(timeoutId)
                    if (socket) socket.destroy()
                    if (!isResolved) {
                        isResolved = true
                        reject(new Error(`處理憑證時發生錯誤: ${(error as Error).message}`))
                    }
                }
            })

            socket.on('error', (error) => {
                clearTimeout(timeoutId)
                if (!isResolved) {
                    isResolved = true
                    console.error(`TLS 連接錯誤: ${error.message}`)
                    reject(new Error(`TLS 連接失敗: ${error.message}`))
                }
            })

            // 移除 timeout 事件監聽器，因為我們使用 setTimeout

        } catch (error) {
            clearTimeout(timeoutId)
            if (!isResolved) {
                isResolved = true
                reject(new Error(`建立連接時發生錯誤: ${(error as Error).message}`))
            }
        }
    })
}

/**
 * 批量檢查多個網站 - 使用批次處理避免記憶體問題
 */
export async function checkMultipleCertificates(urls: string[], batchSize: number = 3): Promise<CertificateResult[]> {
    const results: CertificateResult[] = []

    // 批次處理以避免記憶體問題
    const batches = _.chunk(urls, batchSize)
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        const batchPromises = _.map(batch, async (url) => {
            try {
                const { hostname, port } = parseAndValidateUrl(url)
                const result = await getTLSCertificateInfo(hostname, port)
                return {
                    url: url,
                    ...result
                }
            } catch (error) {
                logger.error(`處理網址 ${url} 時發生錯誤：${(error as Error).message}`)
                return {
                    url: url,
                    success: false,
                    error: (error as Error).message
                }
            }
        })

        // 等待當前批次完成
        const CertificateResults = await Promise.allSettled(batchPromises)

        _.forEach(CertificateResults, (result) => {
            if (result.status === 'fulfilled') {
                results.push(result.value)
            } else {
                results.push({
                    url: 'unknown',
                    validFrom: '',
                    validTo: '',
                    isValid: false,
                    error: result.reason?.message || '未知錯誤'
                })
            }
        })

        if (i + 1 < batches.length) {
            // 在批次之間加入短暫延遲以避免同時發送過多請求
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }

    return results
}