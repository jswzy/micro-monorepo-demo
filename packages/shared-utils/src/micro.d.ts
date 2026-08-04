/**
 * 微应用生命周期适配层
 *
 * 两个子应用（app-order / app-goods）共用同一段接入逻辑，沉淀在域内公共包里：
 * - 被基座（wujie）加载时：注册 __WUJIE_MOUNT / __WUJIE_UNMOUNT，并通知基座可以挂载
 * - 直接访问自己的端口时：立即渲染，保证「独立开发、独立部署」不受微前端框架绑架
 *
 * 本文件不依赖 vue，避免公共包与框架版本耦合。
 */
export interface MicroLifecycle {
    /** 渲染（创建 Vue 实例并 mount） */
    mount: () => void;
    /** 卸载（unmount 并清理副作用） */
    unmount: () => void;
}
export declare function bootstrapMicroApp({ mount, unmount }: MicroLifecycle): void;
/** 读取基座通过 props 传入的数据（独立运行时返回空对象） */
export declare function getMicroProps<T extends Record<string, unknown>>(): Partial<T>;
