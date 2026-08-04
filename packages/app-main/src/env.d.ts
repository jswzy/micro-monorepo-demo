/// <reference types="vite/client" />

/**
 * 注意：这里刻意不写 `declare module '*.vue'` 的通配 shim。
 * vue-tsc 会直接解析 SFC 得到真实组件类型，写了 shim 反而会让所有组件退化成 any，
 * 丢掉「公共组件库自动类型提示」这一验收项。
 */

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string
  readonly VITE_ORDER_URL?: string
  readonly VITE_GOODS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
