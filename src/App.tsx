import React, { Suspense, useState, useEffect } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/LoadingSpinner'
import { BottomNavigation } from './components/BottomNavigation'
import { PerformanceMonitor } from './utils/PerformanceMonitor'
import './App.css'

// 动态导入远程模块
const HomeApp = React.lazy(() => import('homeApp/App'))
const GameApp = React.lazy(() => import('gameApp/App'))
const UserApp = React.lazy(() => import('userApp/App'))

interface Route {
  id: string
  name: string
  icon: string
  component: 'home' | 'game' | 'user' | 'local'
}

const routes: Route[] = [
  { id: 'home', name: '首页', icon: '🏠', component: 'home' },
  { id: 'games', name: '游戏', icon: '🎮', component: 'game' },
  { id: 'user', name: '用户', icon: '👤', component: 'user' },
  { id: 'about', name: '关于', icon: 'ℹ️', component: 'local' }
]

function App() {
  const [currentRoute, setCurrentRoute] = useState('home')
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  
  useEffect(() => {
    // 启动性能监控
    PerformanceMonitor.init()
    PerformanceMonitor.trackAppStart()
    
    return () => {
      PerformanceMonitor.cleanup()
    }
  }, [])

  const handleRouteChange = (routeId: string) => {
    const startTime = performance.now()
    setCurrentRoute(routeId)
    
    // 记录路由切换性能
    requestAnimationFrame(() => {
      const endTime = performance.now()
      PerformanceMonitor.trackRouteChange(routeId, endTime - startTime)
    })
  }

  const renderContent = () => {
    const currentRouteData = routes.find(r => r.id === currentRoute) || routes[0]
    
    switch (currentRouteData.component) {
      case 'home':
        return (
          <ErrorBoundary 
            fallback={<div className="error-fallback">首页服务暂时不可用 🏠</div>}
            onError={(error) => PerformanceMonitor.trackError('HomeApp', error)}
          >
            <Suspense fallback={<LoadingSpinner message="加载首页服务中..." />}>
              <HomeApp />
            </Suspense>
          </ErrorBoundary>
        )
      
      case 'game':
        return (
          <ErrorBoundary 
            fallback={<div className="error-fallback">游戏服务暂时不可用 🎮</div>}
            onError={(error) => PerformanceMonitor.trackError('GameApp', error)}
          >
            <Suspense fallback={<LoadingSpinner message="加载游戏服务中..." />}>
              <GameApp />
            </Suspense>
          </ErrorBoundary>
        )
      
      case 'user':
        return (
          <ErrorBoundary 
            fallback={<div className="error-fallback">用户服务暂时不可用 👤</div>}
            onError={(error) => PerformanceMonitor.trackError('UserApp', error)}
          >
            <Suspense fallback={<LoadingSpinner message="加载用户服务中..." />}>
              <UserApp />
            </Suspense>
          </ErrorBoundary>
        )
      
      case 'local':
        return (
          <div className="local-content">
            <h1>🚀 Gaming Platform</h1>
            <h2>Rsbuild + Module Federation 架构演示</h2>
            
            <div className="feature-grid">
              <div className="feature-card">
                <h3>⚡ 极速构建</h3>
                <p>基于 Rust 的 Rspack，构建速度提升 3-5x</p>
              </div>
              
              <div className="feature-card">
                <h3>🏗️ 微服务架构</h3>
                <p>Module Federation 2.0 原生支持</p>
              </div>
              
              <div className="feature-card">
                <h3>🧠 智能优化</h3>
                <p>自动代码分割、依赖共享、预加载</p>
              </div>
              
              <div className="feature-card">
                <h3>🛠️ 开发体验</h3>
                <p>热更新、类型提示、调试工具</p>
              </div>
            </div>

            <div className="performance-stats">
              <h3>📊 性能指标</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-label">启动时间:</span>
                  <span className="stat-value" id="startup-time">计算中...</span>
                </div>
                <div className="stat">
                  <span className="stat-label">内存使用:</span>
                  <span className="stat-value" id="memory-usage">计算中...</span>
                </div>
                <div className="stat">
                  <span className="stat-label">活跃服务:</span>
                  <span className="stat-value">3/3</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return <div className="error-fallback">未知页面</div>
    }
  }

  // 更新性能统计
  useEffect(() => {
    const updateStats = () => {
      const startupTimeEl = document.getElementById('startup-time')
      const memoryUsageEl = document.getElementById('memory-usage')
      
      if (startupTimeEl && window.__GAMING_PLATFORM_START_TIME__) {
        const loadTime = performance.now() - window.__GAMING_PLATFORM_START_TIME__
        startupTimeEl.textContent = `${loadTime.toFixed(0)}ms`
      }
      
      if (memoryUsageEl && 'memory' in performance) {
        const memory = (performance as any).memory
        if (memory) {
          const usedMB = Math.round(memory.usedJSHeapSize / 1048576)
          memoryUsageEl.textContent = `${usedMB}MB`
        }
      }
    }
    
    updateStats()
    const interval = setInterval(updateStats, 2000)
    
    return () => clearInterval(interval)
  }, [currentRoute])

  return (
    <div className="app">
      <main className="app-main">
        {renderContent()}
      </main>
      
      <BottomNavigation
        routes={routes}
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
      />
    </div>
  )
}

export default App