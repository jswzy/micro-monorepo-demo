import { onMounted, ref, watch } from 'vue'
import { fetchOrders, fetchOrderSummary, microBus } from '@demo/shared-utils'
import type { OrderEntity } from '@demo/shared-utils'

/**
 * 订单列表逻辑抽离为 composable：视图只管渲染
 */
export function useOrderList() {
  const list = ref<OrderEntity[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(4)
  const keyword = ref('')
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const res = await fetchOrders({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value,
      })
      list.value = res.list
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  /** 向基座广播订单概览（事件契约来自 shared-utils，类型安全） */
  async function reportToShell() {
    microBus.emit('order', await fetchOrderSummary())
  }

  function onSearch(value: string) {
    keyword.value = value
    page.value = 1
  }

  watch([page, keyword], load)

  onMounted(async () => {
    await load()
    await reportToShell()
  })

  return { list, total, page, pageSize, keyword, loading, load, onSearch }
}
