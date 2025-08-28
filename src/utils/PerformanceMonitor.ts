/**
 * 性能监控工具
 * 专门为 Module Federation 微前端架构设计
 */
class PerformanceMonitorClass {
  private metrics: Map<string, any> = new Map()
  private observers: PerformanceObserver[] = []
  
  init() {
    this.initPerformanceObservers()
    this.trackMemoryUsage()
  }

  private initPerformanceObservers() {
    // 监控导航性能
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.metrics.set('navigation', {
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              loadComplete: entry.loadEventEnd - entry.loadEventStart,
              timestamp: Date.now()
            })
          }
        }
      })

      try {
        navObserver.observe({ entryTypes: ['navigation'] })
        this.observers.push(navObserver)
      } catch (e) {
        console.warn('Navigation observer not supported')
      }

      // 监控资源加载（包括远程模块）
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('remoteEntry.js') || entry.name.includes('mf-manifest.json')) {
            console.log(`📦 Remote Module Load: ${entry.name} - ${entry.duration.toFixed(2)}ms`)
            
            this.metrics.set(`remote_${entry.name}`, {
              duration: entry.duration,
              transferSize: (entry as any).transferSize || 0,
              timestamp: Date.now()
            })
          }
        }
      })

      try {
        resourceObserver.observe({ entryTypes: ['resource'] })
        this.observers.push(resourceObserver)
      } catch (e) {
        console.warn('Resource observer not supported')
      }
    }
  }

  trackAppStart() {
    const startTime = window.__GAMING_PLATFORM_START_TIME__ || performance.now()
    
    // 记录应用启动指标
    requestIdleCallback(() => {
      const endTime = performance.now()
      const metrics = {
        totalStartTime: endTime - startTime,
        domReady: document.readyState,
        timestamp: Date.now()
      }
      
      this.metrics.set('app_start', metrics)
      
      console.group('🚀 App Performance Metrics')
      console.log('Total Start Time:', `${metrics.totalStartTime.toFixed(2)}ms`)
      console.log('DOM Ready State:', metrics.domReady)
      console.groupEnd()
    })
  }

  trackRouteChange(route: string, duration: number) {
    const metrics = {
      route,
      duration,
      timestamp: Date.now(),
      memoryUsage: this.getMemoryUsage()
    }
    
    this.metrics.set(`route_${route}_${Date.now()}`, metrics)
    
    console.log(`🔄 Route Change: ${route} - ${duration.toFixed(2)}ms`)
  }

  trackError(service: string, error: Error) {
    const errorMetrics = {
      service,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href
    }
    
    this.metrics.set(`error_${service}_${Date.now()}`, errorMetrics)
    
    console.error(`🚨 Service Error [${service}]:`, error)
  }

  trackMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        if (memory) {
          this.metrics.set('memory_current', {
            used: Math.round(memory.usedJSHeapSize / 1048576), // MB
            total: Math.round(memory.totalJSHeapSize / 1048576), // MB
            limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
            timestamp: Date.now()
          })
        }
      }, 5000) // 每5秒记录一次
    }
  }

  private getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      if (memory) {
        return {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576)
        }
      }
    }
    return null
  }

  getMetrics() {
    return Array.from(this.metrics.entries()).reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, any>)
  }

  exportMetrics() {
    const allMetrics = this.getMetrics()
    const blob = new Blob([JSON.stringify(allMetrics, null, 2)], { 
      type: 'application/json' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gaming-platform-metrics-${Date.now()}.json`
    a.click()
    
    URL.revokeObjectURL(url)
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }

  // 性能分析工具
  startMeasure(name: string) {
    performance.mark(`${name}-start`)
  }

  endMeasure(name: string) {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const measure = performance.getEntriesByName(name, 'measure')[0]
    if (measure) {
      console.log(`📊 ${name}: ${measure.duration.toFixed(2)}ms`)
      
      this.metrics.set(`measure_${name}`, {
        duration: measure.duration,
        timestamp: Date.now()
      })
    }
  }
}

export const PerformanceMonitor = new PerformanceMonitorClass()

// 全局暴露给开发者使用
declare global {
  interface Window {
    __GAMING_PLATFORM_PERF__: typeof PerformanceMonitor
  }
}

if (process.env.NODE_ENV === 'development') {
  window.__GAMING_PLATFORM_PERF__ = PerformanceMonitor
}