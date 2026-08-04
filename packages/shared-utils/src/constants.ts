import { isDev } from './env'
import type { GoodsStatus, MicroAppMeta, OrderStatus } from './types'

/** 内部命名空间，所有包名前缀统一为 @demo/xxx */
export const NAMESPACE = '@demo' as const

/** 当前业务域标识（一仓 = 一个业务域） */
export const DOMAIN = 'trade' as const

/** localStorage key 统一加域前缀，避免同域名下多业务域互相覆盖 */
export const STORAGE_KEYS = {
  token: `${DOMAIN}:token`,
  userInfo: `${DOMAIN}:user-info`,
  theme: `${DOMAIN}:theme`,
} as const

/** 订单状态文案 + 色板 */
export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; type: string }> = {
  pending: { label: '待付款', type: 'warning' },
  paid: { label: '已付款', type: 'primary' },
  shipped: { label: '已发货', type: 'info' },
  finished: { label: '已完成', type: 'success' },
  canceled: { label: '已取消', type: 'danger' },
}

/** 商品状态文案 + 色板 */
export const GOODS_STATUS_MAP: Record<GoodsStatus, { label: string; type: string }> = {
  on: { label: '在售', type: 'success' },
  off: { label: '已下架', type: 'info' },
}

/** 微应用名称常量，基座与子应用共用同一份，杜绝魔法字符串 */
export const MICRO_APP_NAMES = {
  order: 'app-order',
  goods: 'app-goods',
} as const

/**
 * 微应用注册表 —— 唯一事实来源
 * dev: 各子应用各自的 vite dev server
 * prod: 各子应用独立打包后部署到的静态路径（可换成独立域名/CDN）
 */
export const MICRO_APPS: MicroAppMeta[] = [
  {
    name: MICRO_APP_NAMES.order,
    title: '订单中心',
    path: '/order',
    icon: '🧾',
    url: isDev() ? 'http://localhost:5174/' : '/sub/order/',
  },
  {
    name: MICRO_APP_NAMES.goods,
    title: '商品中心',
    path: '/goods',
    icon: '📦',
    url: isDev() ? 'http://localhost:5175/' : '/sub/goods/',
  },
]

/** 各子应用固定端口，避免开发时互相抢占 */
export const DEV_PORTS = {
  main: 5173,
  order: 5174,
  goods: 5175,
} as const
