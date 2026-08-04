import { createRouter, createWebHistory } from 'vue-router'
import type { Router, RouteRecordRaw } from 'vue-router'

import OrderListView from '../views/OrderListView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'order-list', component: OrderListView, meta: { title: '订单列表' } },
  {
    path: '/detail/:id',
    name: 'order-detail',
    component: OrderDetailView,
    props: true,
    meta: { title: '订单详情' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

/**
 * 每次 mount 都新建 router 实例：
 * 微前端下应用可能被反复挂载/卸载，复用同一个 router 会残留历史监听
 */
export function createAppRouter(): Router {
  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })
}
