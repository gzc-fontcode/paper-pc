import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/theme.scss" as *;`
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 用户相关接口代理
      '/user-api': {
        target: 'http://47.109.72.203:20001', // 替换为实际的接口服务器地址
        changeOrigin: true,
        bypass(req, res, options) {
          const proxyURL = options.target + options.rewrite(req.url)
          req.headers['x-req-proxyURL'] = proxyURL // 设置未生效
          res.setHeader('x-req-proxyURL', proxyURL) // 设置响应头可以看到
        },
        rewrite: (path) => path.replace(/^\/user-api/, '')
      },
      // 知识库相关接口代理
      '/know-api': {
        target: 'http://47.109.72.203:20000', // 新服务地址
        changeOrigin: true,
        bypass(req, res, options) {
          const proxyURL = options.target + options.rewrite(req.url)
          req.headers['x-req-proxyURL'] = proxyURL // 设置未生效
          res.setHeader('x-req-proxyURL', proxyURL) // 设置响应头可以看到
        },
        rewrite: (path) => path.replace(/^\/know-api/, '') // 可选路径重写
      }
    },
  },
})
