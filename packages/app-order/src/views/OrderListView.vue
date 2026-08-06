<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ORDER_STATUS_MAP,
  formatDate,
  formatMoney,
  microBus,
  runtimeMode,
  type GoodsPicked,
  type MicroAppSource,
  type OrderEntity,
} from '@demo/shared-utils'
import {
  DemoButton,
  DemoCard,
  DemoPagination,
  DemoSearchInput,
  DemoTable,
  DemoTag,
  useSharedState,
  type TableColumn,
  type ThemeType,
} from '@demo/ui-package'
import { useOrderList } from '../composables/useOrderList'

const router = useRouter()
const { list, total, page, pageSize, keyword, loading, load, onSearch } = useOrderList()

// 列定义完全类型安全：数据列 key 只能是 OrderEntity 的字段，写错立刻报错
const columns: TableColumn<OrderEntity>[] = [
  { key: 'orderNo', title: '订单号', width: '160px' },
  { key: 'customer', title: '客户' },
  { key: 'goodsName', title: '商品' },
  { key: 'amount', title: '金额', width: '120px', align: 'right' },
  { key: 'status', title: '状态', width: '110px' },
  { key: 'createdAt', title: '下单时间', width: '150px' },
  { key: 'op', title: '操作', width: '180px' },
]

const statusType = (row: OrderEntity): ThemeType =>
  ORDER_STATUS_MAP[row.status].type as ThemeType

function goDetail(row: OrderEntity) {
  router.push({ name: 'order-detail', params: { id: row.id } })
}

/* ----------------------------- 跨应用：订单域 -> 商品域 ----------------------------- */
// 把本行关注的「商品名」推给商品域，让其在列表里高亮（子应用之间经 wujie 共享 bus 传值）
function pushToGoods(row: OrderEntity) {
  microBus.emit('order:focus-goods', {
    goodsName: row.goodsName,
    source: 'app-order' as MicroAppSource,
  })
  selected.value = row
}

const selected = ref<OrderEntity | null>(null)
const pushedTip = ref('')

function onPushToGoods(row: OrderEntity) {
  pushToGoods(row)
  pushedTip.value = `已把「${row.goodsName}」推给商品域，去商品中心看高亮`
  window.setTimeout(() => (pushedTip.value = ''), 2600)
}

/* ----------------------------- 跨应用：商品域 -> 订单域 ----------------------------- */
// 监听商品域推过来的「选中商品」（与商品域之间通过同一个 bus 互通）
const lastFromGoods = ref<(GoodsPicked & { at: string }) | null>(null)

const offGoodsPick = microBus.on('goods:pick', (payload) => {
  lastFromGoods.value = { ...payload, at: formatDate(Date.now(), 'HH:mm:ss') }
})

onBeforeUnmount(offGoodsPick)

/* ----------------------------- 跨应用：共享状态（响应式同步） ----------------------------- */
// 订单域设置「当前关注客户」，商品域会实时同步展示（useSharedState 底层走共享 bus）
const { value: focusCustomer, set: setFocusCustomer } = useSharedState<string>(
  'cross:customer',
  '',
  'app-order',
)
</script>

<template>
  <div class="order-page">
    <DemoCard
      title="订单列表"
      :subtitle="`数据来自 @demo/shared-utils 的统一请求层 · 当前运行模式：${runtimeMode()}`"
    >
      <template #extra>
        <div class="toolbar">
          <DemoSearchInput
            v-model="keyword"
            placeholder="搜索订单号 / 客户 / 商品"
            @search="onSearch"
          />
          <DemoButton size="small" type="primary" @click="load">刷新</DemoButton>
        </div>
      </template>

      <DemoTable
        :columns="columns"
        :data="list"
        row-key="id"
        :loading="loading"
        empty-text="没有匹配的订单"
      >
        <template #cell-amount="{ row }">
          <strong class="amount">{{ formatMoney((row as OrderEntity).amount) }}</strong>
        </template>
        <template #cell-status="{ row }">
          <DemoTag
            :type="statusType(row as OrderEntity)"
            :text="ORDER_STATUS_MAP[(row as OrderEntity).status].label"
          />
        </template>
        <template #cell-createdAt="{ row }">
          {{ formatDate((row as OrderEntity).createdAt, 'MM-DD HH:mm') }}
        </template>
        <template #cell-op="{ row }">
          <DemoButton size="small" type="primary" @click="onPushToGoods(row as OrderEntity)">
            推给商品域
          </DemoButton>
          <DemoButton size="small" plain @click="goDetail(row as OrderEntity)">详情</DemoButton>
        </template>
      </DemoTable>

      <template #footer>
        <DemoPagination v-model:page="page" :page-size="pageSize" :total="total" />
      </template>
    </DemoCard>

    <!-- 跨应用联动面板：直观展示「两个子应用之间传值」 -->
    <div class="linkage">
      <DemoCard title="① 订单域 → 商品域（事件传值）">
        <p class="hint">
          点击表格「推给商品域」按钮，本订单关注的商品名会通过
          <code>microBus.emit('order:focus-goods')</code> 发往商品域，商品中心对应商品随即高亮。
        </p>
        <p v-if="selected" class="status-line">
          已推送：<strong>{{ selected.goodsName }}</strong>（来自订单 {{ selected.orderNo }}）
        </p>
        <p v-if="pushedTip" class="status-line status-line--ok">{{ pushedTip }}</p>
        <p v-if="!selected" class="status-line status-line--muted">尚未推送，点一行试试。</p>
      </DemoCard>

      <DemoCard title="② 商品域 → 订单域（事件传值）">
        <p class="hint">
          在商品中心点「推给订单域」，此处会实时收到 <code>goods:pick</code> 事件。
        </p>
        <div v-if="lastFromGoods" class="picked">
          <span class="picked__tag">来自商品域</span>
          <strong>{{ lastFromGoods.name }}</strong>
          <span class="picked__sku">{{ lastFromGoods.sku }}</span>
          <span class="picked__price">{{ formatMoney(lastFromGoods.price) }}</span>
          <span class="picked__time">{{ lastFromGoods.at }}</span>
        </div>
        <p v-else class="status-line status-line--muted">等待商品域推送…</p>
      </DemoCard>
    </div>

    <DemoCard title="③ 共享状态（响应式同步）">
      <p class="hint">
        订单域写入 <code>useSharedState('cross:customer')</code>，商品域同一份 key 的视图会同步更新。
      </p>
      <div class="shared-row">
        <label>共享给商品域的当前客户</label>
        <input
          class="shared-input"
          :value="focusCustomer"
          placeholder="例如：张三 / 某连锁超市"
          @input="setFocusCustomer(($event.target as HTMLInputElement).value)"
        />
        <span class="shared-preview">商品域实时显示：{{ focusCustomer || '（空）' }}</span>
      </div>
    </DemoCard>
  </div>
</template>

<style scoped>
.order-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.amount {
  color: var(--demo-color-danger);
  font-variant-numeric: tabular-nums;
}
.linkage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 980px) {
  .linkage {
    grid-template-columns: 1fr;
  }
}
.hint {
  margin: 0 0 10px;
  font-size: 12.5px;
  color: var(--demo-text-secondary);
  line-height: 1.7;
}
.hint code,
.shared-row code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: rgba(0, 0, 0, 0.05);
  padding: 1px 5px;
  border-radius: 4px;
}
.status-line {
  margin: 6px 0 0;
  font-size: 13px;
}
.status-line--ok {
  color: var(--demo-color-success);
}
.status-line--muted {
  color: var(--demo-text-secondary);
}
.picked {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px;
  background: var(--demo-color-primary-weak);
  border-radius: var(--demo-radius-sm);
}
.picked__tag {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 10px;
  background: var(--demo-color-primary);
  color: #fff;
}
.picked__sku {
  color: var(--demo-text-secondary);
  font-size: 12px;
}
.picked__price {
  color: var(--demo-color-danger);
  font-variant-numeric: tabular-nums;
}
.picked__time {
  margin-left: auto;
  color: var(--demo-text-secondary);
  font-size: 12px;
}
.shared-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.shared-row label {
  font-size: 13px;
  color: var(--demo-text-regular);
}
.shared-input {
  flex: 1;
  min-width: 200px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--demo-border-color);
  border-radius: var(--demo-radius-sm);
  font-size: 13px;
  outline: none;
}
.shared-input:focus {
  border-color: var(--demo-color-primary);
}
.shared-preview {
  font-size: 12.5px;
  color: var(--demo-color-primary);
}
</style>
