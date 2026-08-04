/**
 * 运行环境探针
 * 抽出来的原因：本包既会被 Vite 以源码方式编译（域内子应用），
 * 也会被 tsc 编译成 dist 后发 npm（跨业务域消费），两种场景都要能正常工作。
 */
/** 是否开发态 */
export declare const isDev: () => boolean;
/** 是否运行在 wujie 微前端沙箱内（即：作为子应用被基座加载） */
export declare const isInMicroSandbox: () => boolean;
/** 当前运行模式描述，用于 Demo 页面直观展示 */
export declare const runtimeMode: () => "\u72EC\u7ACB\u8FD0\u884C" | "\u5FAE\u524D\u7AEF\u5B50\u5E94\u7528";
