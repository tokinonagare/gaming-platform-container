import React, { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Module Federation Error:', error, errorInfo)
    
    // 调用错误回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    
    // 错误上报（可以集成到监控服务）
    this.reportError(error, errorInfo)
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // 在实际项目中，这里可以集成错误监控服务
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    console.group('📊 Error Report')
    console.log('Error Data:', errorData)
    console.groupEnd()
  }

  render() {
    if (this.state.hasError) {
      // 使用自定义 fallback 或默认 fallback
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div className="error-fallback">
          <h2>🚨 模块加载失败</h2>
          <p>{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            刷新页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}