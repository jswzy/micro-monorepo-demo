import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * 商品子应用 —— 独立构建、独立部署
 * 部署路径可通过 VITE_PUBLIC_BASE 覆盖（例如换成独立域名 https://goods.demo.com/）
 */
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.VITE_PUBLIC_BASE ?? '/sub/goods/') : '/',
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  optimizeDeps: {
    exclude: ['@demo/shared-utils', '@demo/ui-package'],
  },
  server: {
    port: 5175,
    strictPort: true,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  preview: {
    port: 4175,
    strictPort: true,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
}))
