import type { GoodsEntity, OrderEntity, PageQuery, PageResult } from './types';
/** Demo 数据源：真实项目里这里换成 http.get('/orders', query) */
export declare function fetchOrders(query: PageQuery): Promise<PageResult<OrderEntity>>;
export declare function fetchGoods(query: PageQuery): Promise<PageResult<GoodsEntity>>;
export declare function fetchOrderSummary(): Promise<{
    total: number;
    pendingCount: number;
}>;
export declare function fetchGoodsSummary(): Promise<{
    total: number;
    offSaleCount: number;
}>;
