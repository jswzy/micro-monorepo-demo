import { createApp } from 'vue'
import WujieVue from 'wujie-vue3'

// 域内公共包：组件库 + 工具库
import { DemoUI } from '@demo/ui-package'
import { setBaseURL } from '@demo/shared-utils'

import App from './App.vue'
import { router } from './router'
import './styles/main.css'

setBaseURL('/api/trade')

createApp(App).use(router).use(WujieVue).use(DemoUI).mount('#app')
