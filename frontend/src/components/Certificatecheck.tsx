import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import {fetchCertificateAPI} from "../tools/fetch"
import '../styles/Certificatecheck.css'
import { CertificateResult } from '../tools/interface'

function Certificatecheck() {
  const [urls, setUrls] = useState<string>(() => {
  const savedUrls = localStorage.getItem('savedUrls')
  return savedUrls || ''
  })
  const [results, setResults] = useState<CertificateResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [duplicateUrls, setDuplicateUrls] = useState<string[]>([])
  useEffect(() => {
  localStorage.setItem('savedUrls', urls)

  // 檢查重複網址
  const urlList = _.chain(urls)
    .split('\n')
    .map(_.trim)
    .filter((url: string) => url.length > 0)
    .value()
  const duplicates = _.chain(urlList)
    .countBy()
    .pickBy((count: number) => count > 1)
    .keys()
    .value()
  setDuplicateUrls(duplicates)
  }, [urls])

  const handleUrlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUrls = event.target.value
    setUrls(newUrls)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const urlList = _.chain(urls)
      .split('\n')
      .map(_.trim)
      .value()
    try {
      const certificateResults = await fetchCertificateAPI(urlList)
      setResults(certificateResults)
    } catch (error) {
      console.error('檢查證書時發生錯誤:', error)
      alert('檢查證書時發生錯誤:' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportUrls = () => {
    const blob = new Blob([urls], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'urlsList.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="app-container">
      <h1>證書日期檢查工具</h1>

      <div className="input-section">
        <label htmlFor="url-input" className="input-label">
          請輸入要檢查的網址（每行一個）：
        </label>

        <textarea
          id="url-input"
          className="url-textarea"
          value={urls}
          onChange={handleUrlChange}
          placeholder="請輸入或貼上網址，例如：&#10;https://www.google.com&#10;https://www.github.com"
          rows={10}
          cols={60}
        />

        {duplicateUrls.length > 0 && (
          <div className="duplicate-warning">
            <p>⚠️ 發現重複的網址：</p>
            <ul>
              {duplicateUrls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="button-section">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!urls.trim() || isLoading}
          >
            {isLoading ? '檢查中...' : '開始檢查證書'}
          </button>

          <button
            className="clear-btn"
            onClick={() => {
              setResults([])
            }}
            disabled={!urls.trim()}
          >
            清除檢查結果
          </button>

          <button
            className="export-btn"
            onClick={handleExportUrls}
            disabled={!urls.trim()}
          >
            匯出網址
          </button>
        </div>
      </div>

      {urls && (
        <div className="preview-section">
          <h3>預覽（共 {_.chain(urls).split('\n').filter(_.trim).size().value()} 個網址）</h3>
          <div className="url-preview">
            {_.chain(urls)
              .split('\n')
              .map(_.trim)
              .filter((url: string) => url.length > 0)
              .map((url: string, index: number) => (
                <div key={index} className="url-item">
                  {index + 1}. <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </div>
              ))
              .value()
            }
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="results-section">
          <h3>檢查結果</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>序號</th>
                <th>網址</th>
                <th>憑證開始日</th>
                <th>憑證結束日</th>
                <th>狀態</th>
                <th>錯誤訊息</th>
              </tr>
            </thead>
            <tbody>
              {_.chain(results)
                .map((result: CertificateResult, index: number) => (
                  <tr key={index} className={result.isValid ? 'valid' : 'invalid'}>
                    <td>{index + 1}</td>
                    <td><a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a></td>
                    <td>{new Date(result.validFrom).toLocaleDateString()}</td>
                    <td>{new Date(result.validTo).toLocaleDateString()}</td>
                    <td>{result.isValid ? '有效' : '無效'}</td>
                    <td>{result.error || '-'}</td>
                  </tr>
                ))
                .value()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Certificatecheck