import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * 组件库仅在「发布 npm 包给其他业务域」时才需要构建产物；
 * 域内子应用开发/构建时直接吃 src 源码（见 package.json exports）。
 */
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'DemoUI',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    cssCodeSplit: false,
    rollupOptions: {
      // vue 与域内公共包不打进产物，交由使用方提供
      external: ['vue', '@demo/shared-utils'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith('.css') ? 'ui-package.css' : 'assets/[name][extname]',
      },
    },
  },
})
