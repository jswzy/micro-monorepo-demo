import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** 基座应用：独立构建、独立部署（部署到域名根路径） */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  /**
   * 关键：把域内公共包排除出预构建，Vite 直接编译它们的源码，
   * 从而实现「改 shared-utils / ui-package -> 本应用 HMR 实时生效」
   */
  optimizeDeps: {
    exclude: ['@demo/shared-utils', '@demo/ui-package'],
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
  },
  preview: { port: 4173, strictPort: true },
  build: {
    outDir: 'dist',
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
})
