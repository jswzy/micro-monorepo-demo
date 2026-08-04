/**
 * 业务域通用类型定义
 * 子应用 import type 后自动获得完整 TS 提示（无需 d.ts 构建，开发态直连源码）
 */
/** 统一响应结构 */
export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T;
}
/** 分页入参 */
export interface PageQuery {
    page: number;
    pageSize: number;
    keyword?: string;
}
/** 分页出参 */
export interface PageResult<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}
/** 订单状态 */
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'finished' | 'canceled';
/** 订单实体 */
export interface OrderEntity {
    id: string;
    orderNo: string;
    customer: string;
    goodsName: string;
    amount: number;
    status: OrderStatus;
    createdAt: string;
}
/** 商品上下架状态 */
export type GoodsStatus = 'on' | 'off';
/** 商品实体 */
export interface GoodsEntity {
    id: string;
    sku: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: GoodsStatus;
}
/** 登录用户 */
export interface UserInfo {
    id: string;
    name: string;
    role: 'admin' | 'staff';
    domain: string;
}
/** 微应用注册信息（基座消费） */
export interface MicroAppMeta {
    /** 唯一名称，同时作为 wujie 沙箱 name */
    name: string;
    /** 菜单标题 */
    title: string;
    /** 基座路由路径 */
    path: string;
    /** 运行时入口地址（dev 指向各自 vite server，prod 指向独立部署域名/子路径） */
    url: string;
    icon?: string;
}
/** 跨应用事件载荷（基座 <-> 子应用通信契约） */
export interface MicroEventPayload {
    order: {
        total: number;
        pendingCount: number;
    };
    goods: {
        total: number;
        offSaleCount: number;
    };
    navigate: {
        path: string;
    };
}
export type MicroEventName = keyof MicroEventPayload;
declare global {
    interface WujieBus {
        $emit: (event: string, ...args: unknown[]) => void;
        $on: (event: string, fn: (...args: unknown[]) => void) => void;
        $off: (event: string, fn: (...args: unknown[]) => void) => void;
        $onAll?: (fn: (event: string, ...args: unknown[]) => void) => void;
    }
    interface WujieInstance {
        bus: WujieBus;
        props?: Record<string, unknown>;
        mount: () => void;
        location?: Location;
        shadowRoot?: ShadowRoot;
    }
    interface Window {
        /** wujie 沙箱标记：为 true 说明当前是被基座加载的子应用 */
        __POWERED_BY_WUJIE__?: boolean;
        /** wujie 实例，bus / props 从这里取 */
        $wujie?: WujieInstance;
        __WUJIE?: {
            mount: () => void;
        };
        /** 子应用需要挂载的生命周期钩子 */
        __WUJIE_MOUNT?: () => void;
        __WUJIE_UNMOUNT?: () => void;
        /** 子应用静态资源前缀（wujie 注入） */
        __WUJIE_PUBLIC_PATH__?: string;
    }
}
