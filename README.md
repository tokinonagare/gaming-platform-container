# 🌐 Gaming Platform Container App

Gaming Platform的微前端主容器应用，基于Module Federation架构，负责加载和管理各个微应用。

## 🏗️ 架构角色

作为**Host应用**，Container App负责：
- 🔗 加载远程微应用 (Home、Game、User)
- 🧭 路由管理和导航控制
- 🎨 全局UI框架和布局
- 🛡️ 错误边界和降级处理
- 📱 响应式设计和移动端适配

## 🔌 Module Federation 配置

### 远程应用映射
```typescript
remotes: {
  sharedLib: 'http://localhost:3100/remoteEntry.js',
  homeApp: 'http://localhost:3001/remoteEntry.js', 
  gameApp: 'http://localhost:3002/remoteEntry.js',
  userApp: 'http://localhost:3003/remoteEntry.js'
}
```

### 共享依赖
- **React**: 单例模式，确保版本一致
- **React-DOM**: 单例模式，避免冲突
- **其他依赖**: 按需共享

## 🎯 核心功能

### 🧭 导航系统
- **底部导航**: 主要页面快速切换
- **智能路由**: 动态加载微应用组件
- **状态同步**: 跨应用的状态管理

### 🛡️ 错误处理
- **Error Boundary**: 微应用错误隔离
- **Loading State**: 优雅的加载状态
- **Fallback UI**: 加载失败时的降级界面

### 📱 用户体验
- **Performance Monitor**: 性能监控和优化
- **Loading Spinner**: 统一的加载动画
- **Responsive Design**: 跨设备兼容

## 🚀 开发

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问: http://localhost:3000

# 构建
npm run build

# 预览构建结果
npm run preview
```

### 环境要求
- Node.js 16+
- 先启动共享库 (3100)
- 先启动各微应用 (3001, 3002, 3003)

## 📦 项目结构

```
src/
├── components/           # 通用组件
│   ├── ErrorBoundary.tsx    # 错误边界
│   ├── LoadingSpinner.tsx   # 加载组件  
│   └── BottomNavigation.tsx # 底部导航
├── utils/               # 工具函数
│   └── PerformanceMonitor.ts
├── App.tsx              # 主应用组件
├── App.css              # 全局样式
└── main.tsx             # 应用入口
```

## 🔗 微应用集成

### 动态导入微应用
```typescript
import React from 'react'

// 动态导入远程组件
const HomeApp = React.lazy(() => import('homeApp/App'))
const GameApp = React.lazy(() => import('gameApp/App'))
const UserApp = React.lazy(() => import('userApp/App'))

// 错误边界包装
<ErrorBoundary>
  <Suspense fallback={<LoadingSpinner />}>
    <HomeApp />
  </Suspense>
</ErrorBoundary>
```

### 共享库集成
```typescript
// 使用共享API客户端
import { createApiClient } from 'sharedLib/apiClient'
import type { ServerStatus } from 'sharedLib/types'

const api = createApiClient('gateway')
const status = await api.get<ServerStatus>('/status')
```

## 🎨 UI/UX 设计

### 设计原则
- **一致性**: 统一的设计语言和组件库
- **响应式**: 支持桌面、平板、手机
- **可访问性**: 符合WCAG标准
- **性能优先**: 懒加载和代码分割

### 主题系统
- **颜色方案**: 支持亮色/暗色主题
- **字体系统**: 多级字体层次
- **间距规范**: 8px栅格系统

## 📈 性能优化

### Module Federation优化
- **代码分割**: 按路由和功能拆分
- **预加载策略**: 智能预加载关键模块
- **缓存策略**: 长期缓存远程模块

### 运行时优化
- **懒加载**: 路由级别的懒加载
- **错误恢复**: 微应用失败时的优雅降级
- **性能监控**: 实时性能指标收集

## 🔧 配置说明

### Rsbuild配置
- **Module Federation Host**: 配置为主应用
- **远程应用**: 映射所有微应用入口
- **构建优化**: 生产环境优化配置

### 环境变量
```bash
# 开发环境
RSBUILD_DEV_SERVER_PORT=3000
RSBUILD_SHARED_LIB_URL=http://localhost:3100

# 生产环境  
RSBUILD_SHARED_LIB_URL=https://shared.gaming-platform.com
RSBUILD_HOME_APP_URL=https://home.gaming-platform.com
```

## 🚀 部署

### 构建流程
1. 构建共享库和各微应用
2. 构建容器应用
3. 部署到CDN或静态托管服务
4. 配置生产环境的远程模块URL

### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔗 相关项目

- [Gaming Platform Shared](https://github.com/tokinonagare/gaming-platform-shared) - 共享库
- [Gaming Platform Home](https://github.com/tokinonagare/gaming-platform-home) - 首页微应用
- [Gaming Platform Game](https://github.com/tokinonagare/gaming-platform-game) - 游戏库微应用  
- [Gaming Platform User](https://github.com/tokinonagare/gaming-platform-user) - 用户微应用

## 🐛 故障排除

### 常见问题

**微应用加载失败**
```bash
# 检查远程应用是否启动
curl http://localhost:3001/remoteEntry.js
curl http://localhost:3002/remoteEntry.js
```

**Module Federation错误**
- 确保使用build+preview模式
- 检查远程应用的remoteEntry.js可访问性
- 验证共享依赖版本一致性

**性能问题**
- 检查网络延迟
- 优化微应用大小  
- 启用缓存策略

---

**🌐 容器应用 - 微前端架构的核心枢纽！**