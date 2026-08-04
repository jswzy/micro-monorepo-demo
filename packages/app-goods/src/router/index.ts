import { createRouter, createWebHistory } from 'vue-router'
import type { Router, RouteRecordRaw } from 'vue-router'

import GoodsListView from '../views/GoodsListView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'goods-list', component: GoodsListView, meta: { title: '商品列表' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export function createAppRouter(): Router {
  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })
}
