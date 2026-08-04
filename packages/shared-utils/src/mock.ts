import { mockRequest } from './request'
import type { GoodsEntity, OrderEntity, PageQuery, PageResult } from './types'

const ORDERS: OrderEntity[] = [
  {
    id: '1',
    orderNo: 'SO20260803001',
    customer: '华东制造集团',
    goodsName: '工业级防滑手套 L',
    amount: 128600,
    status: 'pending',
    createdAt: '2026-08-01 09:12:00',
  },
  {
    id: '2',
    orderNo: 'SO20260803002',
    customer: '南方能源',
    goodsName: '不锈钢内六角扳手套装',
    amount: 45900,
    status: 'paid',
    createdAt: '2026-08-01 14:40:00',
  },
  {
    id: '3',
    orderNo: 'SO20260803003',
    customer: '西部重工',
    goodsName: '高精度数显卡尺 0-150mm',
    amount: 289000,
    status: 'shipped',
    createdAt: '2026-08-02 10:05:00',
  },
  {
    id: '4',
    orderNo: 'SO20260803004',
    customer: '长江物流',
    goodsName: '劳保安全鞋 42 码',
    amount: 76800,
    status: 'finished',
    createdAt: '2026-08-02 16:28:00',
  },
  {
    id: '5',
    orderNo: 'SO20260803005',
    customer: '北方化工',
    goodsName: '耐酸碱防护服 XL',
    amount: 153200,
    status: 'canceled',
    createdAt: '2026-08-03 08:03:00',
  },
  {
    id: '6',
    orderNo: 'SO20260803006',
    customer: '华东制造集团',
    goodsName: '气动冲击扳手',
    amount: 421000,
    status: 'pending',
    createdAt: '2026-08-03 11:47:00',
  },
]

const GOODS: GoodsEntity[] = [
  {
    id: 'g1',
    sku: 'SKU-0001',
    name: '工业级防滑手套 L',
    category: '劳保用品',
    price: 2580,
    stock: 1240,
    status: 'on',
  },
  {
    id: 'g2',
    sku: 'SKU-0002',
    name: '不锈钢内六角扳手套装',
    category: '手动工具',
    price: 15300,
    stock: 320,
    status: 'on',
  },
  {
    id: 'g3',
    sku: 'SKU-0003',
    name: '高精度数显卡尺 0-150mm',
    category: '量具仪器',
    price: 28900,
    stock: 86,
    status: 'on',
  },
  {
    id: 'g4',
    sku: 'SKU-0004',
    name: '劳保安全鞋 42 码',
    category: '劳保用品',
    price: 19200,
    stock: 0,
    status: 'off',
  },
  {
    id: 'g5',
    sku: 'SKU-0005',
    name: '耐酸碱防护服 XL',
    category: '劳保用品',
    price: 38300,
    stock: 45,
    status: 'off',
  },
  {
    id: 'g6',
    sku: 'SKU-0006',
    name: '气动冲击扳手',
    category: '电动工具',
    price: 105250,
    stock: 12,
    status: 'on',
  },
]

function paginate<T>(source: T[], query: PageQuery, match: (item: T, kw: string) => boolean) {
  const kw = (query.keyword ?? '').trim().toLowerCase()
  const filtered = kw ? source.filter((item) => match(item, kw)) : source
  const start = (query.page - 1) * query.pageSize
  return {
    list: filtered.slice(start, start + query.pageSize),
    total: filtered.length,
    page: query.page,
    pageSize: query.pageSize,
  }
}

/** Demo 数据源：真实项目里这里换成 http.get('/orders', query) */
export function fetchOrders(query: PageQuery): Promise<PageResult<OrderEntity>> {
  return mockRequest(
    paginate(ORDERS, query, (o, kw) =>
      [o.orderNo, o.customer, o.goodsName].some((f) => f.toLowerCase().includes(kw)),
    ),
  )
}

export function fetchGoods(query: PageQuery): Promise<PageResult<GoodsEntity>> {
  return mockRequest(
    paginate(GOODS, query, (g, kw) =>
      [g.sku, g.name, g.category].some((f) => f.toLowerCase().includes(kw)),
    ),
  )
}

export function fetchOrderSummary(): Promise<{ total: number; pendingCount: number }> {
  return mockRequest({
    total: ORDERS.length,
    pendingCount: ORDERS.filter((o) => o.status === 'pending').length,
  })
}

export function fetchGoodsSummary(): Promise<{ total: number; offSaleCount: number }> {
  return mockRequest({
    total: GOODS.length,
    offSaleCount: GOODS.filter((g) => g.status === 'off').length,
  })
}
