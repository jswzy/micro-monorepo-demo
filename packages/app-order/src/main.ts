import { createApp } from 'vue'
import type { App as VueApp } from 'vue'

import { DemoUI } from '@demo/ui-package'
import { bootstrapMicroApp, setBaseURL } from '@demo/shared-utils'

import App from './App.vue'
import { createAppRouter } from './router'
import './styles/main.css'

setBaseURL('/api/trade/order')

let instance: VueApp<Element> | null = null

function mount() {
  instance = createApp(App)
  instance.use(createAppRouter()).use(DemoUI)
  instance.mount('#app')
}

function unmount() {
  instance?.unmount()
  instance = null
}

// 独立运行 or 作为微应用运行，一行搞定（逻辑沉淀在 @demo/shared-utils）
bootstrapMicroApp({ mount, unmount })
