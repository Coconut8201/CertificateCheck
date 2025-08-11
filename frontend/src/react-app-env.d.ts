/// <reference types="react-scripts" />
declare module 'lodash'

// 為環境變數添加類型宣告
interface ImportMetaEnv {
  readonly REACT_APP_BACKEND_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 為 process.env 添加類型宣告
declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_BACKEND_API: string
  }
}