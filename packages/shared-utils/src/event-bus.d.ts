import type { MicroEventName, MicroEventPayload } from './types';
type Handler<E extends MicroEventName> = (payload: MicroEventPayload[E]) => void;
/**
 * 跨应用事件总线
 * - 在 wujie 沙箱内：转发到 window.$wujie.bus，实现基座 <-> 子应用通信
 * - 独立运行时：退化为本地 EventEmitter，保证子应用单独启动也不报错
 *
 * 事件名与载荷由 MicroEventPayload 约束，跨应用通信全程类型安全。
 */
declare class MicroEventBus {
    private local;
    private get wujieBus();
    emit<E extends MicroEventName>(event: E, payload: MicroEventPayload[E]): void;
    on<E extends MicroEventName>(event: E, handler: Handler<E>): () => void;
    off<E extends MicroEventName>(event: E, handler: Handler<E>): void;
}
export declare const microBus: MicroEventBus;
export {};
