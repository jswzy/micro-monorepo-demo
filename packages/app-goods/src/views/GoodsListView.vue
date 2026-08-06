<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import {
  GOODS_STATUS_MAP,
  formatMoney,
  microBus,
  runtimeMode,
  truncate,
  type GoodsEntity,
  type MicroAppSource,
  type OrderFocusGoods,
} from '@demo/shared-utils'
import {
  DemoButton,
  DemoCard,
  DemoPagination,
  DemoSearchInput,
  DemoStatCard,
  DemoTable,
  DemoTag,
  useSharedState,
  type TableColumn,
  type ThemeType,
} from '@demo/ui-package'
import { useGoodsList } from '../composables/useGoodsList'

const { list, total, page, pageSize, keyword, loading, lowStock, load, onSearch } = useGoodsList()

const selected = ref<GoodsEntity | null>(null)

const columns: TableColumn<GoodsEntity>[] = [
  { key: 'sku', title: 'SKU', width: '120px' },
  { key: 'name', title: '商品名称' },
  { key: 'category', title: '分类', width: '110px' },
  { key: 'price', title: '单价', width: '110px', align: 'right' },
  { key: 'stock', title: '库存', width: '90px', align: 'right' },
  { key: 'status', title: '状态', width: '100px' },
  { key: 'op', title: '操作', width: '160px' },
]

const statusType = (row: GoodsEntity): ThemeType => GOODS_STATUS_MAP[row.status].type as ThemeType

/* ----------------------------- 跨应用：商品域 -> 订单域（事件传值） ----------------------------- */
// 把选中的商品推给订单域（订单域会实时收到 goods:pick 事件）
function pushToOrder(row: GoodsEntity) {
  microBus.emit('goods:pick', {
    sku: row.sku,
    name: row.name,
    price: row.price,
    source: 'app-goods' as MicroAppSource,
  })
  selected.value = row
}

// 工具栏快捷：随机推一件给订单域
function pushRandom() {
  const row = list.value[Math.floor(Math.random() * list.value.length)]
  if (row) pushToOrder(row)
}

/* ----------------------------- 跨应用：订单域 -> 商品域（事件传值 + 高亮） ----------------------------- */
// 监听订单域推来的「关注商品名」，在列表里高亮对应行
const highlightName = ref('')
const highlightFrom = ref(false)
const offFocus = microBus.on('order:focus-goods', (payload: OrderFocusGoods) => {
  highlightName.value = payload.goodsName
  highlightFrom.value = true
  window.setTimeout(() => (highlightFrom.value = false), 4000)
})
onBeforeUnmount(offFocus)

const isHighlighted = (row: GoodsEntity) => highlightFrom.value && row.name === highlightName.value

/* ----------------------------- 跨应用：共享状态（响应式同步） ----------------------------- */
// 订阅订单域写入的「当前关注客户」，实时展示（与订单域同一份 key）
const { value: focusCustomer } = useSharedState<string>('cross:customer', '', 'app-goods')

const banner = computed(() =>
  focusCustomer.value
    ? `订单域正在关注客户：${focusCustomer.value}（经 useSharedState 跨应用同步）`
    : '',
)
</script>

<template>
  <div class="page">
    <div v-if="banner" class="cross-banner">
      🔗 {{ banner }}
    </div>

    <div class="page__stats">
      <DemoStatCard label="当前页 SKU" :value="list.length" :hint="`共 ${total} 个`" accent="primary" />
      <DemoStatCard label="低库存(<50)" :value="lowStock" hint="需补货" accent="warning" />
      <DemoStatCard label="运行模式" :value="runtimeMode()" hint="同一份代码两种形态" accent="info" />
    </div>

    <DemoCard title="商品列表" subtitle="表格、标签、分页全部来自 @demo/ui-package">
      <template #extra>
        <div class="toolbar">
          <DemoSearchInput v-model="keyword" placeholder="搜索 SKU / 名称 / 分类" @search="onSearch" />
          <DemoButton size="small" type="primary" @click="load">刷新</DemoButton>
          <DemoButton size="small" type="success" @click="pushRandom">随机推给订单域</DemoButton>
        </div>
      </template>

      <DemoTable
        :columns="columns"
        :data="list"
        row-key="id"
        :loading="loading"
        empty-text="没有匹配的商品"
      >
        <template #cell-name="{ row }">
          <span class="name" :class="{ 'name--hl': isHighlighted(row as GoodsEntity) }" :title="(row as GoodsEntity).name">
            {{ truncate((row as GoodsEntity).name, 18) }}
          </span>
        </template>
        <template #cell-price="{ row }">
          <span class="num">{{ formatMoney((row as GoodsEntity).price) }}</span>
        </template>
        <template #cell-stock="{ row }">
          <span class="num" :class="{ 'is-low': (row as GoodsEntity).stock < 50 }">
            {{ (row as GoodsEntity).stock }}
          </span>
        </template>
        <template #cell-status="{ row }">
          <DemoTag :type="statusType(row as GoodsEntity)" :text="GOODS_STATUS_MAP[(row as GoodsEntity).status].label" />
        </template>
        <template #cell-op="{ row }">
          <DemoButton size="small" type="success" @click="pushToOrder(row as GoodsEntity)">
            推给订单域
          </DemoButton>
        </template>
      </DemoTable>

      <template #footer>
        <DemoPagination v-model:page="page" :page-size="pageSize" :total="total" />
      </template>
    </DemoCard>

    <DemoCard v-if="selected" title="选中商品" :subtitle="selected.sku">
      <template #extra>
        <DemoButton size="small" type="info" plain @click="selected = null">关闭</DemoButton>
      </template>
      <p class="picked">
        {{ selected.name }} · {{ selected.category }} · {{ formatMoney(selected.price) }} · 库存
        {{ selected.stock }}
      </p>
      <p class="picked__tip">
        点击「推给订单域」会触发 <code>microBus.emit('goods:pick')</code>，订单中心对应卡片实时更新。
      </p>
    </DemoCard>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cross-banner {
  padding: 10px 14px;
  background: var(--demo-color-primary-weak);
  color: var(--demo-color-primary);
  border: 1px solid var(--demo-color-primary);
  border-radius: var(--demo-radius-md);
  font-size: 13px;
}
.page__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.num {
  font-variant-numeric: tabular-nums;
}
.is-low {
  color: var(--demo-color-danger);
  font-weight: 600;
}
.name--hl {
  color: var(--demo-color-primary);
  font-weight: 600;
  background: var(--demo-color-primary-weak);
  padding: 1px 6px;
  border-radius: 4px;
}
.picked {
  margin: 0;
  font-size: 13px;
  color: var(--demo-text-regular);
}
.picked__tip {
  margin: 8px 0 0;
  font-size: 12.5px;
  color: var(--demo-text-secondary);
}
.picked__tip code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: rgba(0, 0, 0, 0.05);
  padding: 1px 5px;
  border-radius: 4px;
}
</style>
