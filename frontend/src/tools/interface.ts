export interface CertificateResult {
  url: string
  validFrom: string    // 憑證開始日
  validTo: string      // 憑證結束日
  isValid: boolean
  error?: string
}