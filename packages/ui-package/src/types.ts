/** 组件库对外类型：子应用 import type 即获得完整提示 */

export type ThemeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export type ButtonSize = 'small' | 'medium' | 'large'

export interface TableColumn<T extends object = Record<string, unknown>> {
  /**
   * 列标识，同时作为具名插槽 key：#cell-<key>
   * - 数据列：建议用真实字段名（keyof T），可获得取值类型校验
   * - 操作列：可用任意字符串（如 'op'），用插槽自定义按钮，再用 field 指定取值字段
   */
  key: string
  /** 数据列取值字段；省略时回退到 key（兼容纯数据列写法） */
  field?: Extract<keyof T, string>
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
}
