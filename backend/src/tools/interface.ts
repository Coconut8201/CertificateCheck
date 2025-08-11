export interface SubjectAltName {
    type: string
    value: string
}

export interface CertificateChain {
    subject: any
    issuer: any
    fingerprint: string
    serialNumber: string
}

export interface UrlParseResult {
    hostname: string
    port: number
}

export interface CertificateResult {
    url: string
    validFrom: string   // 憑證開始日
    validTo: string     // 憑證結束日
    isValid: boolean
    error?: string
}