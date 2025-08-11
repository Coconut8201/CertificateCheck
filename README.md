# CertificateCheck

## 🔧 1. 這是什麼工具？

**CertificateCheck** 是一個 **SSL/TLS 憑證檢查工具**，專門用來批量檢查網站憑證的有效性和到期時間。

### 主要功能
- 🔍 批量檢查多個網站的 SSL 憑證狀態
- 📅 顯示憑證的開始時間和到期時間  
- ✅ 即時判斷憑證是否有效
- 🌐 支援 Web 介面操作
- 📡 提供 REST API 介面

## ⏰ 2. 什麼時候需要用這個工具？

### 適用情境
- **網站管理員** - 需要定期檢查多個網站的憑證到期時間
- **系統運維** - 批量監控公司旗下所有網站的憑證狀態
- **安全檢查** - 驗證網站憑證是否正常運作
- **憑證更新前** - 確認哪些網站需要更新憑證
- **網站遷移** - 檢查新環境的憑證配置是否正確

### 使用時機
- 📊 每月憑證狀態檢查
- ⚠️ 憑證即將到期提醒
- 🔄 憑證更新後驗證
- 🆕 新網站上線後檢查

## 📖 3. 怎麼使用？

> **⚠️ 重要提醒：請根據您的使用情境選擇對應的部署方式**
> - **開發階段** → 請使用「開發模式」（支援 Docker 或手動安裝）
> - **正式環境** → 請使用「生產模式」（Docker 部署）

### 🔧 開發模式（Development）

**適用情境：** 程式開發、功能測試、本地除錯

> **💡 開發模式提供兩種運行方式，請選擇適合您的方式：**
> - **Docker 方式** - 快速啟動，環境一致性高
> - **手動安裝方式** - 可直接修改程式碼，即時看到變更

#### 方式一：Docker 開發環境（推薦）

1. **複製專案**
   ```bash
   git clone https://github.com/Coconut8201/CertificateCheck.git
   cd CertificateCheck
   ```

2. **啟動開發環境**
   ```bash
   docker-compose -f docker-compose.development.yml up -d
   ```

3. **查看運行狀態**
   ```bash
   docker-compose -f docker-compose.development.yml ps
   ```

#### Docker 開發環境管理
```bash
# 停止開發服務
docker-compose -f docker-compose.development.yml down

# 重新建置並啟動
docker-compose -f docker-compose.development.yml up --build -d
```

#### 方式二：手動安裝開發環境

1. **複製專案**
   ```bash
   git clone https://github.com/Coconut8201/CertificateCheck.git
   cd CertificateCheck
   ```

2. **設定環境變數（Windows PowerShell）**
   ```powershell
   # 創建前端環境檔案（如果有 .env.example）
   copy frontend\.env.example frontend\.env
   
   # 創建後端環境檔案（如果有 .env.example）
   copy backend\.env.example backend\.env
   ```

3. **啟動後端服務**
   ```bash
   cd backend
   pnpm install
   pnpm build
   pnpm dev
   ```

4. **啟動前端服務（另開新終端）**
   ```bash
   cd frontend
   pnpm install
   pnpm start
   ```

#### 開發模式服務存取
- **前端介面**：http://localhost:3000
- **後端 API**：http://localhost:9614

---

### 🚀 生產模式（Production）

**適用情境：** 正式環境部署、伺服器運行

#### 部署步驟

1. **複製專案**
   ```bash
   git clone https://github.com/Coconut8201/CertificateCheck.git
   cd CertificateCheck
   ```

2. **建置生產映像檔**
   ```bash
   docker-compose -f docker-compose.production.yml build
   ```

3. **啟動生產服務**
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

#### 生產模式服務存取
- **前端介面**：http://localhost:3000
- **後端 API**：http://localhost:9614

#### 管理生產服務
```bash
# 停止服務
docker-compose -f docker-compose.production.yml down

# 查看服務狀態
docker-compose -f docker-compose.production.yml ps
```

### 操作步驟
1. **輸入網址** - 在文字框中貼上要檢查的 HTTPS 網址（每行一個）
2. **開始檢查** - 點擊「開始檢查證書」按鈕
3. **查看結果** - 系統會顯示每個網站的憑證資訊

### 支援的網址格式
- ✅ `https://www.google.com`
- ✅ `https://github.com:443`
- ❌ `http://example.com` （僅支援 HTTPS）
- ❌ `www.google.com` （需要完整 URL）

## ✅ 4. 怎麼確認系統運作正常？

### 🔧 開發模式檢查

#### 4.1 檢查開發服務狀態

**Docker 開發環境檢查：**
```bash
# 查看容器狀態
docker-compose -f docker-compose.development.yml ps
```

**手動安裝環境檢查：**
1. **確認後端服務運行**
   - 檢查終端顯示：`Server running on port 9614` 或類似訊息
   - 瀏覽器訪問：http://localhost:9614 （應該有回應）

2. **確認前端服務運行**
   - 檢查終端顯示：`webpack compiled` 或 `Local: http://localhost:3000`
   - 瀏覽器訪問：http://localhost:3000 （應該載入介面）

### 🚀 生產模式檢查

#### 4.1 檢查容器服務狀態
```bash
# 查看容器狀態
docker-compose -f docker-compose.production.yml ps
```

**正常狀態應該顯示：**
- 前端服務運行在 port 3000
- 後端服務運行在 port 9614
- 兩個服務都是 "Up" 狀態

### 📋 通用功能測試

#### 4.2 測試系統功能
1. **檢查網頁載入** 
   - 瀏覽器前往：http://localhost:3000
   - 頁面應該正常載入並顯示憑證檢查介面

2. **測試憑證檢查功能**
   - 在文字區域輸入：`https://www.google.com`
   - 點擊「開始檢查證書」
   - 等待檢查完成

3. **確認結果顯示**
   - 應該顯示憑證有效期間
   - 顯示憑證狀態（有效/無效）

### 4.3 預期的正常結果
檢查結果應該包含：
- ✅ 網址
- ✅ 憑證開始日期
- ✅ 憑證到期日期  
- ✅ 有效狀態（有效/無效）

### 4.4 測試用網址
建議使用以下網址進行測試：
- `https://www.google.com`

## ❗ 5. 可能遇到的問題與解決方法

### 🔧 開發模式常見問題

#### Docker 開發環境問題

**問題：Docker 容器無法啟動**
```bash
# 解決方法
docker-compose -f docker-compose.development.yml down
docker-compose -f docker-compose.development.yml build --no-cache
docker-compose -f docker-compose.development.yml up -d
```

**問題：開發模式端口被占用**
```bash
# 檢查端口使用情況
netstat -an | findstr "3000"
netstat -an | findstr "9614"

# 解決方法：修改 docker-compose.development.yml 中的端口設定
```

#### 手動安裝環境問題

**問題：pnpm 指令無法執行**
**症狀：** 提示 `pnpm: command not found`
```bash
# 解決方法：安裝 pnpm
npm install -g pnpm
```

**問題：Node.js 版本過舊**
**症狀：** 安裝套件時出現相容性錯誤
- **解決方法：** 更新 Node.js 至 v20 以上版本

**問題：端口被占用**
**症狀：** 提示 port 3000 或 9614 已被使用
```bash
# Windows 檢查端口使用情況
netstat -an | findstr "3000"
netstat -an | findstr "9614"

# 解決方法：終止占用端口的程序或修改 package.json 中的端口設定
```

**問題：套件安裝失敗**
**症狀：** `pnpm install` 執行失敗
```bash
# 解決方法
# 1. 清除快取
pnpm store prune

# 2. 刪除 node_modules 重新安裝
rm -rf node_modules
pnpm install
```

---

### 🚀 生產模式常見問題

#### 問題：容器無法啟動
**症狀：** docker-compose up 失敗或容器狀態顯示錯誤
```bash
# 解決方法
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

#### 問題：Docker 端口被占用
**症狀：** Docker 提示 port 3000 或 9614 已被使用
```bash
# 檢查端口使用情況
netstat -an | findstr "3000"
netstat -an | findstr "9614"

# 解決方法：修改 docker-compose.production.yml 中的端口設定
```

#### 問題：Docker 映像建置失敗
**症狀：** `docker-compose build` 執行失敗
```bash
# 解決方法
# 1. 清除 Docker 快取
docker system prune -a

# 2. 重新建置
docker-compose -f docker-compose.production.yml build --no-cache
```

---

### 📋 通用問題

#### 網路連線問題

**問題：無法檢查某些網站**
- **症狀：** 特定網站顯示「連線失敗」
- **原因：** 目標網站可能有防火牆或 DDoS 保護
- **解決：** 這是正常情況，某些網站會阻擋自動化檢查

**問題：檢查超時**
- **症狀：** 檢查時間過長或顯示超時錯誤
- **原因：** 網路連線速度慢或目標網站回應慢
- **解決：** 重新嘗試或檢查網路連線

#### 環境設定問題

**問題：CORS 連線錯誤（僅生產模式）**
- **症狀：** 瀏覽器 console 顯示 CORS 錯誤
- **解決方法：**
  - 確認將 IP 位址加入到 `docker-compose.production.yml` 的 `CORS_ORIGINS` 中
  - 執行 `docker-compose -f docker-compose.production.yml up -d` 重新啟動
  - 重新載入網頁

## 🔧 API 使用

### API 文檔

#### 憑證檢查 API
**端點：** `POST /api/certificate-checker`  
**描述：** 批量檢查多個網站的SSL憑證狀態

##### 請求格式(bash)
```bash
curl -X POST http://localhost:9614/api/certificate-checker \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://www.google.com", "https://www.youtube.com"]}'
```

##### 請求格式(PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:9614/api/certificate-checker" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"urls": ["https://www.google.com", "https://www.youtube.com"]}'
```

##### 請求參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| urls | string[] | ✅ | 要檢查的HTTPS網址陣列 |

##### 回應格式
```json
[
  {
    // 成功
    "url": "https://www.google.com",1
    "valid_from": "2024-01-15T00:00:00.000Z",
    "valid_until": "2024-04-15T23:59:59.000Z",
    "is_valid": true,
    "error": null
  },
  {
    // 失敗
    "url": "https://invalid-site.com",
    "valid_from": null,
    "valid_until": null,
    "is_valid": false,
    "error": "連線失敗或憑證無效"
  }
]
```

##### 回應欄位說明
| 欄位 | 類型 | 說明 |
|------|------|------|
| url | string | 檢查的網址 |
| valid_from | string/null | 憑證開始有效時間 (ISO 8601 格式) |
| valid_until | string/null | 憑證到期時間 (ISO 8601 格式) |
| is_valid | boolean | 憑證是否有效 |
| error | string/null | 錯誤訊息（如果檢查失敗） |

##### 狀態碼
- **200 OK** - 請求成功處理
- **400 Bad Request** - 請求格式錯誤
- **500 Internal Server Error** - 伺服器內部錯誤

### OKD 部署

#### 基本部署
```bash
# 部署應用程式
oc apply -f okd_config/deploy.yaml

# 部署服務
oc apply -f okd_config/service.yaml

# 或一次部署所有設定
oc apply -f okd_config/
```

#### 更新部署 (v1.0.0)
```bash
# 登入 registry
docker login [docker server]

# 後端映像
#重新標記docker image
docker tag certificatecheck-backend:1.0.0 [server site]

# 推送image 到私人伺服器上
docker push [server site]

# 重新啟動okd 部署服務
oc rollout restart deployment/certificatecheck-backend -n site-cert-check

# 前端映像
docker tag certificatecheck-frontend:1.0.0 [server site]

#重新標記docker image
docker push [server site]

# 重新啟動okd 部署服務
oc rollout restart deployment/certificatecheck-frontend -n site-cert-check
```
