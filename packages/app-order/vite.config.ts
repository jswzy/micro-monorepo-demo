import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * 订单子应用 —— 独立构建、独立部署
 * 部署路径可通过 VITE_PUBLIC_BASE 覆盖（例如换成独立域名 https://order.demo.com/）
 */
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.VITE_PUBLIC_BASE ?? '/sub/order/') : '/',
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // 域内公共包走源码编译，改公共包本应用立即 HMR
  optimizeDeps: {
    exclude: ['@demo/shared-utils', '@demo/ui-package'],
  },
  server: {
    port: 5174,
    strictPort: true,
    // 基座跨端口加载子应用，必须放开 CORS
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  preview: {
    port: 4174,
    strictPort: true,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
}))
