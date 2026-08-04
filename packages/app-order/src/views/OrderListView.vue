<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ORDER_STATUS_MAP,
  formatDate,
  formatMoney,
  runtimeMode,
  type OrderEntity,
} from '@demo/shared-utils'
import {
  DemoButton,
  DemoCard,
  DemoPagination,
  DemoSearchInput,
  DemoTable,
  DemoTag,
  type TableColumn,
  type ThemeType,
} from '@demo/ui-package'
import { useOrderList } from '../composables/useOrderList'

const router = useRouter()
const { list, total, page, pageSize, keyword, loading, load, onSearch } = useOrderList()

// 列定义完全类型安全：key 只能是 OrderEntity 的字段，写错立刻报错
const columns: TableColumn<OrderEntity>[] = [
  { key: 'orderNo', title: '订单号', width: '160px' },
  { key: 'customer', title: '客户' },
  { key: 'goodsName', title: '商品' },
  { key: 'amount', title: '金额', width: '120px', align: 'right' },
  { key: 'status', title: '状态', width: '110px' },
  { key: 'createdAt', title: '下单时间', width: '150px' },
]

const statusType = (row: OrderEntity): ThemeType =>
  ORDER_STATUS_MAP[row.status].type as ThemeType

function goDetail(row: OrderEntity) {
  router.push({ name: 'order-detail', params: { id: row.id } })
}
</script>

<template>
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
      @row-click="goDetail"
    >
      <template #cell-amount="{ row }">
        <strong class="amount">{{ formatMoney(row.amount) }}</strong>
      </template>
      <template #cell-status="{ row }">
        <DemoTag :type="statusType(row)" :text="ORDER_STATUS_MAP[row.status].label" />
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatDate(row.createdAt, 'MM-DD HH:mm') }}
      </template>
    </DemoTable>

    <template #footer>
      <DemoPagination v-model:page="page" :page-size="pageSize" :total="total" />
    </template>
  </DemoCard>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.amount {
  color: var(--demo-color-danger);
  font-variant-numeric: tabular-nums;
}
</style>
