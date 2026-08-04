/** 组件库对外类型：子应用 import type 即获得完整提示 */

export type ThemeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export type ButtonSize = 'small' | 'medium' | 'large'

export interface TableColumn<T extends object = Record<string, unknown>> {
  /** 取值字段名，同时作为具名插槽 key：#cell-<key> */
  key: Extract<keyof T, string>
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
}
