import { onBeforeUnmount, onMounted, ref } from 'vue'
import WujieVue from 'wujie-vue3'
import type { MicroEventPayload } from '@demo/shared-utils'

const { bus } = WujieVue

/**
 * 基座订阅子应用广播的统计数据
 * 事件名与载荷结构由 @demo/shared-utils 的 MicroEventPayload 约束 —— 通信契约类型安全
 */
export function useMicroStats() {
  const orderStat = ref<MicroEventPayload['order'] | null>(null)
  const goodsStat = ref<MicroEventPayload['goods'] | null>(null)
  const lastEvent = ref<string>('等待子应用上报…')

  const onOrder = (payload: MicroEventPayload['order']) => {
    orderStat.value = payload
    lastEvent.value = `收到 app-order 上报：共 ${payload.total} 单 / 待付款 ${payload.pendingCount}`
  }
  const onGoods = (payload: MicroEventPayload['goods']) => {
    goodsStat.value = payload
    lastEvent.value = `收到 app-goods 上报：共 ${payload.total} 个 SKU / 下架 ${payload.offSaleCount}`
  }

  onMounted(() => {
    bus.$on('order', onOrder)
    bus.$on('goods', onGoods)
  })

  onBeforeUnmount(() => {
    bus.$off('order', onOrder)
    bus.$off('goods', onGoods)
  })

  return { orderStat, goodsStat, lastEvent }
}
