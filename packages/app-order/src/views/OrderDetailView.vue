<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ORDER_STATUS_MAP,
  fetchOrders,
  formatDate,
  formatMoney,
  type OrderEntity,
} from '@demo/shared-utils'
import { DemoButton, DemoCard, DemoEmpty, DemoTag, type ThemeType } from '@demo/ui-package'

const props = defineProps<{ id: string }>()

const router = useRouter()
const order = ref<OrderEntity | null>(null)
const loading = ref(true)

onMounted(async () => {
  const res = await fetchOrders({ page: 1, pageSize: 999 })
  order.value = res.list.find((item) => item.id === props.id) ?? null
  loading.value = false
})
</script>

<template>
  <DemoCard title="订单详情" :subtitle="`订单 ID：${props.id}`">
    <template #extra>
      <DemoButton size="small" type="info" plain @click="router.back()">返回列表</DemoButton>
    </template>

    <div v-if="loading" class="loading">加载中…</div>
    <DemoEmpty v-else-if="!order" text="订单不存在" />
    <dl v-else class="detail">
      <div><dt>订单号</dt><dd>{{ order.orderNo }}</dd></div>
      <div><dt>客户</dt><dd>{{ order.customer }}</dd></div>
      <div><dt>商品</dt><dd>{{ order.goodsName }}</dd></div>
      <div><dt>金额</dt><dd class="detail__amount">{{ formatMoney(order.amount) }}</dd></div>
      <div>
        <dt>状态</dt>
        <dd>
          <DemoTag
            :type="(ORDER_STATUS_MAP[order.status].type as ThemeType)"
            :text="ORDER_STATUS_MAP[order.status].label"
          />
        </dd>
      </div>
      <div><dt>下单时间</dt><dd>{{ formatDate(order.createdAt) }}</dd></div>
    </dl>
  </DemoCard>
</template>

<style scoped>
.loading {
  padding: 32px 0;
  text-align: center;
  color: var(--demo-text-secondary);
  font-size: 13px;
}
.detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px 24px;
  margin: 0;
}
.detail > div {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--demo-border-color);
}
dt {
  width: 72px;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--demo-text-secondary);
}
dd {
  margin: 0;
  font-size: 13px;
  color: var(--demo-text-primary);
}
.detail__amount {
  color: var(--demo-color-danger);
  font-weight: 600;
}
</style>
