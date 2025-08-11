import {apis} from "./api"

export const fetchCertificateAPI = async (urls: string[]) => {
  try {
    console.log('apis.BACKEND_API', apis.BACKEND_API)
    const response = await fetch(apis.BACKEND_API + '/api/certificate-checker', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('Error fetching certificate data:', error)
    throw new Error((error as Error).message || '檢查憑證時發生錯誤')
  }
}