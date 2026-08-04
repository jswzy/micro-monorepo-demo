<script setup lang="ts">
import { ref } from 'vue'
import {
  GOODS_STATUS_MAP,
  formatMoney,
  runtimeMode,
  truncate,
  type GoodsEntity,
} from '@demo/shared-utils'
import {
  DemoButton,
  DemoCard,
  DemoPagination,
  DemoSearchInput,
  DemoStatCard,
  DemoTable,
  DemoTag,
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
]

const statusType = (row: GoodsEntity): ThemeType => GOODS_STATUS_MAP[row.status].type as ThemeType
</script>

<template>
  <div class="page">
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
        </div>
      </template>

      <DemoTable
        :columns="columns"
        :data="list"
        row-key="id"
        :loading="loading"
        empty-text="没有匹配的商品"
        @row-click="(row: GoodsEntity) => (selected = row)"
      >
        <template #cell-name="{ row }">
          <span :title="row.name">{{ truncate(row.name, 18) }}</span>
        </template>
        <template #cell-price="{ row }">
          <span class="num">{{ formatMoney(row.price) }}</span>
        </template>
        <template #cell-stock="{ row }">
          <span class="num" :class="{ 'is-low': row.stock < 50 }">{{ row.stock }}</span>
        </template>
        <template #cell-status="{ row }">
          <DemoTag :type="statusType(row)" :text="GOODS_STATUS_MAP[row.status].label" />
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
    </DemoCard>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
.picked {
  margin: 0;
  font-size: 13px;
  color: var(--demo-text-regular);
}
</style>
