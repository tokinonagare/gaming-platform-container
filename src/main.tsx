import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

declare global {
  interface Window {
    __GAMING_PLATFORM_START_TIME__?: number
  }
}

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

const root = createRoot(container)

// 渲染应用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// 开发环境热更新支持
if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept('./App', () => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })
}