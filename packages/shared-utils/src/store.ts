import { microBus } from './event-bus'
import type { MicroAppSource, MicroEventPayload } from './types'

/**
 * 跨应用共享状态（micro-monorepo 灵魂：运行时是一组独立应用，状态却要互通）
 *
 * 借助 wujie 共享 bus（microBus 内部转发到 window.$wujie.bus），
 * 同一个 key 的写操作会被广播到所有子应用，从而做到「一处设置、处处同步」。
 *
 * 该模块刻意保持框架无关（不依赖 vue），便于公共包下沉复用；
 * Vue 侧的响应式封装放在 @demo/ui-package 的 useSharedState。
 */

/** 可被共享的值类型 */
export type SharedValue = string | number | boolean | null | unknown[] | Record<string, unknown>

const STORE_EVENT = 'shared:state' as const
type StoreEventPayload = MicroEventPayload[typeof STORE_EVENT]

const localStore = new Map<string, unknown>()

/** 读取当前进程的本地值（尚未收到总线广播时返回 undefined） */
export function getShared<T = unknown>(key: string): T | undefined {
  return localStore.get(key) as T | undefined
}

/**
 * 写入共享状态并广播给其它子应用
 * @param key   共享键
 * @param value 值（需可序列化，跨沙箱走 JSON 结构）
 * @param source 来源方，便于排查
 */
export function setShared<T>(key: string, value: T, source: MicroAppSource = 'app-main'): void {
  localStore.set(key, value)
  microBus.emit(STORE_EVENT, { key, value, source } satisfies StoreEventPayload)
}

/**
 * 订阅某个共享 key 的变化
 * - 订阅瞬间若本地已有值，会立即回调一次（与 WebSocket 的「重放」语义一致）
 * - 返回取消订阅函数
 */
export function subscribeShared(key: string, cb: (value: unknown) => void): () => void {
  if (localStore.has(key)) cb(localStore.get(key))

  const handler = (payload: StoreEventPayload) => {
    if (payload.key === key) {
      localStore.set(key, payload.value)
      cb(payload.value)
    }
  }
  return microBus.on(STORE_EVENT, handler)
}
