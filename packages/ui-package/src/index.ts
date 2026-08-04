/**
 * @demo/ui-package —— 业务域公共组件库
 *
 * ⚠️ 边界约束：只服务当前业务域（本仓库内的 app-*）。
 *    其他业务域要复用，必须 `pnpm changeset` 发布 npm 包后依赖。
 */
import type { App, Plugin } from 'vue'

import './styles/theme.css'

import DemoButton from './components/DemoButton.vue'
import DemoCard from './components/DemoCard.vue'
import DemoTag from './components/DemoTag.vue'
import DemoTable from './components/DemoTable.vue'
import DemoStatCard from './components/DemoStatCard.vue'
import DemoEmpty from './components/DemoEmpty.vue'
import DemoSearchInput from './components/DemoSearchInput.vue'
import DemoPagination from './components/DemoPagination.vue'

export {
  DemoButton,
  DemoCard,
  DemoTag,
  DemoTable,
  DemoStatCard,
  DemoEmpty,
  DemoSearchInput,
  DemoPagination,
}

export * from './types'

const components = {
  DemoButton,
  DemoCard,
  DemoTag,
  DemoTable,
  DemoStatCard,
  DemoEmpty,
  DemoSearchInput,
  DemoPagination,
}

/** 全量注册：app.use(DemoUI) */
export const DemoUI: Plugin = {
  install(app: App) {
    Object.entries(components).forEach(([name, comp]) => {
      app.component(name, comp)
    })
  },
}

export default DemoUI

export const UI_PACKAGE_VERSION = '0.1.0'
