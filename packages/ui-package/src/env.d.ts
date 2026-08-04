/// <reference types="vite/client" />

/**
 * 不写 `declare module '*.vue'` 通配 shim：
 * vue-tsc 直接解析 SFC，组件 props / emits / slots 才能对外导出真实类型。
 */
export {}
