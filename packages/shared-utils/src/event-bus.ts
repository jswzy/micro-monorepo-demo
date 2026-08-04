import type { MicroEventName, MicroEventPayload } from './types'

type Handler<E extends MicroEventName> = (payload: MicroEventPayload[E]) => void

/**
 * 跨应用事件总线
 * - 在 wujie 沙箱内：转发到 window.$wujie.bus，实现基座 <-> 子应用通信
 * - 独立运行时：退化为本地 EventEmitter，保证子应用单独启动也不报错
 *
 * 事件名与载荷由 MicroEventPayload 约束，跨应用通信全程类型安全。
 */
class MicroEventBus {
  private local = new Map<string, Set<(payload: never) => void>>()

  private get wujieBus(): WujieBus | undefined {
    if (typeof window === 'undefined') return undefined
    return window.$wujie?.bus
  }

  emit<E extends MicroEventName>(event: E, payload: MicroEventPayload[E]): void {
    this.wujieBus?.$emit(event, payload)
    this.local.get(event)?.forEach((fn) => (fn as Handler<E>)(payload))
  }

  on<E extends MicroEventName>(event: E, handler: Handler<E>): () => void {
    this.wujieBus?.$on(event, handler as (...args: unknown[]) => void)
    if (!this.local.has(event)) this.local.set(event, new Set())
    this.local.get(event)!.add(handler as (payload: never) => void)
    return () => this.off(event, handler)
  }

  off<E extends MicroEventName>(event: E, handler: Handler<E>): void {
    this.wujieBus?.$off(event, handler as (...args: unknown[]) => void)
    this.local.get(event)?.delete(handler as (payload: never) => void)
  }
}

export const microBus = new MicroEventBus()
