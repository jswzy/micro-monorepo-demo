import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { MICRO_APPS } from '@demo/shared-utils'

import DashboardView from '../views/DashboardView.vue'
import MicroAppView from '../views/MicroAppView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: '域工作台' },
  },
  /**
   * 微应用路由由公共包中的注册表自动生成。
   * 新增一个子应用 = packages 下建目录 + 在 MICRO_APPS 里加一条，基座零改动。
   */
  ...MICRO_APPS.map<RouteRecordRaw>((app) => ({
    path: app.path,
    name: app.name,
    component: MicroAppView,
    meta: { title: app.title, microApp: app.name },
  })),
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
