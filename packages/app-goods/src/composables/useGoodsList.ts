import { computed, onMounted, ref, watch } from 'vue'
import { fetchGoods, fetchGoodsSummary, microBus } from '@demo/shared-utils'
import type { GoodsEntity } from '@demo/shared-utils'

export function useGoodsList() {
  const list = ref<GoodsEntity[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(4)
  const keyword = ref('')
  const loading = ref(false)

  const lowStock = computed(() => list.value.filter((g) => g.stock < 50).length)

  async function load() {
    loading.value = true
    try {
      const res = await fetchGoods({
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

  async function reportToShell() {
    microBus.emit('goods', await fetchGoodsSummary())
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

  return { list, total, page, pageSize, keyword, loading, lowStock, load, onSearch }
}
