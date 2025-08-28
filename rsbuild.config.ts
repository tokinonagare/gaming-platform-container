import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'shell',
      
      // Shell应用 - 纯Consumer，只消费不暴露
      remotes: {
        sharedLib: 'sharedLib@http://localhost:3100/remoteEntry.js',
        homeApp: 'homeApp@http://localhost:3001/remoteEntry.js',
        gameApp: 'gameApp@http://localhost:3002/remoteEntry.js',
        userApp: 'userApp@http://localhost:3003/remoteEntry.js'
      },

      // 共享依赖配置
      shared: {
        'react': {
          singleton: true,
          eager: true,
          requiredVersion: '^19.0.0'
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^19.0.0'
        },
        'axios': {
          singleton: true,
          eager: false,
          requiredVersion: '^1.0.0'
        }
      }
    })
  ],

  // 入口配置
  source: {
    entry: {
      index: './src/main.tsx'
    }
  },

  // 开发服务器配置
  dev: {
    port: 3000,
    host: '0.0.0.0'
  },

  // HTML模板配置
  html: {
    template: './src/index.html',
    title: '🎮 Gaming Platform - Shell Application'
  },

  // 构建输出
  output: {
    distPath: {
      root: 'dist'
    }
  }
})