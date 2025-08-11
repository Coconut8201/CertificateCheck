import express from 'express'
import cors from 'cors'
import { checkMultipleCertificates } from "./tools/certificateChecker"
import { CertificateResult } from "./tools/interface"
import logger from './tools/logger'
import dotenv from 'dotenv'
import _ from 'lodash'

dotenv.config()

const app = express()
const port = 9614

// 支援多個CORS來源
const corsSource = process.env.CORS_ORIGINS 
    ? [..._.map(_.split(process.env.CORS_ORIGINS, ','), (origin: string) => {
        const trimmedOrigin = _.trim(origin)
        
        if (trimmedOrigin.startsWith('http://') || trimmedOrigin.startsWith('https://')) {
            return trimmedOrigin
        }

        return [
            `http://${trimmedOrigin}`,
            `https://${trimmedOrigin}`,
            `http://${trimmedOrigin}:3000`,
            `https://${trimmedOrigin}:3000`
        ]
    }).flat(), 'http://localhost:3000']
    : ['http://localhost:3000']

const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // 允許沒有 origin 的請求
        if (!origin) {
            return callback(null, true)
        }

        const normalizedOrigin = origin.replace(/\/$/, '')
        const isAllowed = corsSource.some((allowedOrigin: string) => {
            const normalizedAllowed = allowedOrigin.replace(/\/$/, '')
            return normalizedOrigin === normalizedAllowed
        })
        
        if (isAllowed) {
            callback(null, true)
        } else {
            logger.info(`🔍 CORS 檢查開始`)
            logger.info(`📍 請求來源 (Origin): ${origin}`)
            logger.info(`✅ 允許的來源清單: ${corsSource}`)
            logger.error('錯誤訊息:')
            logger.error(`來源 '${origin}' 不被 CORS 政策允許`)
            callback(new Error(`來源 '${origin}' 不被 CORS 政策允許`))
        }
    }
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req, res) => {
    logger.info('Received request to check certificates')
    res.send('證書日期檢查工具 後端運行中')
})

app.post('/api/certificate-checker', async(req, res) => {
    logger.info('Received request to check certificates')
    const { urls }: { urls: string[] } = req.body
    const result: CertificateResult[] = await checkMultipleCertificates(urls)
    logger.info(`Checked ${urls.length} certificates, results: ${JSON.stringify(result)}`)

    res.json(result)
})

app.listen(port, () => {
    logger.info('Server is starting...')
    logger.info(`Server is running on port ${port}`)
})