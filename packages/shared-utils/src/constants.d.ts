import type { GoodsStatus, MicroAppMeta, OrderStatus } from './types';
/** 内部命名空间，所有包名前缀统一为 @demo/xxx */
export declare const NAMESPACE: "@demo";
/** 当前业务域标识（一仓 = 一个业务域） */
export declare const DOMAIN: "trade";
/** localStorage key 统一加域前缀，避免同域名下多业务域互相覆盖 */
export declare const STORAGE_KEYS: {
    readonly token: "trade:token";
    readonly userInfo: "trade:user-info";
    readonly theme: "trade:theme";
};
/** 订单状态文案 + 色板 */
export declare const ORDER_STATUS_MAP: Record<OrderStatus, {
    label: string;
    type: string;
}>;
/** 商品状态文案 + 色板 */
export declare const GOODS_STATUS_MAP: Record<GoodsStatus, {
    label: string;
    type: string;
}>;
/** 微应用名称常量，基座与子应用共用同一份，杜绝魔法字符串 */
export declare const MICRO_APP_NAMES: {
    readonly order: "app-order";
    readonly goods: "app-goods";
};
/**
 * 微应用注册表 —— 唯一事实来源
 * dev: 各子应用各自的 vite dev server
 * prod: 各子应用独立打包后部署到的静态路径（可换成独立域名/CDN）
 */
export declare const MICRO_APPS: MicroAppMeta[];
/** 各子应用固定端口，避免开发时互相抢占 */
export declare const DEV_PORTS: {
    readonly main: 5173;
    readonly order: 5174;
    readonly goods: 5175;
};
