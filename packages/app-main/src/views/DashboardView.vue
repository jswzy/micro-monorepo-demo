<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  DOMAIN,
  NAMESPACE,
  MICRO_APPS,
  SHARED_UTILS_VERSION,
  fetchGoodsSummary,
  fetchOrderSummary,
  formatDate,
} from '@demo/shared-utils'
import { DemoCard, DemoStatCard, DemoTag, UI_PACKAGE_VERSION } from '@demo/ui-package'
import { useMicroStats } from '../composables/useMicroStats'

const { orderStat, goodsStat, lastEvent } = useMicroStats()

const orderSummary = ref({ total: 0, pendingCount: 0 })
const goodsSummary = ref({ total: 0, offSaleCount: 0 })
const bootAt = ref(formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss'))

onMounted(async () => {
  orderSummary.value = await fetchOrderSummary()
  goodsSummary.value = await fetchGoodsSummary()
})

const packages = [
  { name: `${NAMESPACE}/app-main`, role: '基座应用', deploy: '独立部署', type: 'primary' as const },
  { name: `${NAMESPACE}/app-order`, role: '子应用', deploy: '独立部署', type: 'success' as const },
  { name: `${NAMESPACE}/app-goods`, role: '子应用', deploy: '独立部署', type: 'success' as const },
  { name: `${NAMESPACE}/ui-package`, role: '域内组件库', deploy: '随子应用打包', type: 'warning' as const },
  { name: `${NAMESPACE}/shared-utils`, role: '域内工具库', deploy: '随子应用打包', type: 'warning' as const },
]
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__stats">
      <DemoStatCard
        label="订单总量"
        :value="orderSummary.total"
        :hint="`待付款 ${orderSummary.pendingCount} 单`"
        accent="primary"
      />
      <DemoStatCard
        label="在库 SKU"
        :value="goodsSummary.total"
        :hint="`下架 ${goodsSummary.offSaleCount} 个`"
        accent="success"
      />
      <DemoStatCard label="微应用数" :value="MICRO_APPS.length" hint="均可独立部署" accent="warning" />
      <DemoStatCard label="业务域" :value="DOMAIN" hint="一仓 = 一个业务域" accent="info" />
    </div>

    <div class="dashboard__grid">
      <DemoCard title="仓库构成" subtitle="packages 下的每个目录，要么是独立可部署应用，要么是域内公共包">
        <ul class="pkg-list">
          <li v-for="pkg in packages" :key="pkg.name" class="pkg-list__item">
            <code>{{ pkg.name }}</code>
            <span class="pkg-list__role">{{ pkg.role }}</span>
            <DemoTag :type="pkg.type" :text="pkg.deploy" />
          </li>
        </ul>
        <template #footer>
          <span class="muted">
            shared-utils v{{ SHARED_UTILS_VERSION }} · ui-package v{{ UI_PACKAGE_VERSION }} ·
            基座启动于 {{ bootAt }}
          </span>
        </template>
      </DemoCard>

      <DemoCard title="跨应用通信" subtitle="子应用通过 wujie bus 上报，事件契约由 shared-utils 的类型约束">
        <p class="bus-line">{{ lastEvent }}</p>
        <div class="bus-grid">
          <div class="bus-grid__cell">
            <span>app-order</span>
            <strong>{{ orderStat ? `${orderStat.total} 单` : '未上报' }}</strong>
          </div>
          <div class="bus-grid__cell">
            <span>app-goods</span>
            <strong>{{ goodsStat ? `${goodsStat.total} SKU` : '未上报' }}</strong>
          </div>
        </div>
        <template #footer>
          <span class="muted">打开左侧「订单中心 / 商品中心」后，此处会实时收到子应用广播</span>
        </template>
      </DemoCard>
    </div>

    <DemoCard title="边界约束" subtitle="micro-monorepo 的灵魂：域内自由联调，跨域必须发包">
      <div class="rules">
        <div class="rules__col rules__col--ok">
          <h4>✅ 允许</h4>
          <p>本域子应用直接 <code>workspace:*</code> 引用 ui-package / shared-utils，源码联调、热更新生效</p>
        </div>
        <div class="rules__col rules__col--no">
          <h4>⛔ 禁止</h4>
          <p>
            其他业务域跨仓源码引用本仓能力；如需复用，必须执行
            <code>pnpm changeset</code> 发布 npm 包
          </p>
        </div>
      </div>
    </DemoCard>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}
.dashboard__grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 16px;
}
@media (max-width: 1080px) {
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
}
.pkg-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pkg-list__item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}
.pkg-list__item code {
  min-width: 200px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--demo-text-primary);
}
.pkg-list__role {
  flex: 1;
  color: var(--demo-text-secondary);
}
.bus-line {
  margin: 0 0 12px;
  padding: 10px 12px;
  background: var(--demo-color-primary-weak);
  color: var(--demo-color-primary);
  border-radius: var(--demo-radius-sm);
  font-size: 12.5px;
}
.bus-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.bus-grid__cell {
  padding: 12px;
  border: 1px dashed var(--demo-border-color);
  border-radius: var(--demo-radius-sm);
}
.bus-grid__cell span {
  display: block;
  font-size: 12px;
  color: var(--demo-text-secondary);
}
.bus-grid__cell strong {
  display: block;
  margin-top: 4px;
  font-size: 16px;
}
.rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
@media (max-width: 720px) {
  .rules {
    grid-template-columns: 1fr;
  }
}
.rules__col {
  padding: 12px 14px;
  border-radius: var(--demo-radius-sm);
  font-size: 13px;
  line-height: 1.7;
}
.rules__col h4 {
  margin: 0 0 6px;
  font-size: 13px;
}
.rules__col p {
  margin: 0;
  color: var(--demo-text-regular);
}
.rules__col--ok {
  background: var(--demo-color-success-weak);
}
.rules__col--no {
  background: var(--demo-color-danger-weak);
}
code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: rgba(0, 0, 0, 0.04);
  padding: 1px 5px;
  border-radius: 4px;
}
.muted {
  font-size: 12px;
  color: var(--demo-text-secondary);
}
</style>
