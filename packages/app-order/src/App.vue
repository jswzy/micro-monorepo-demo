<script setup lang="ts">
import { runtimeMode, isInMicroSandbox } from '@demo/shared-utils'
import { DemoTag } from '@demo/ui-package'
</script>

<template>
  <div class="app">
    <!-- 独立运行时才显示自己的标题栏；被基座加载时由基座提供外壳 -->
    <header v-if="!isInMicroSandbox()" class="app__bar">
      <span class="app__logo">🧾</span>
      <strong>订单中心</strong>
      <code>@demo/app-order</code>
      <DemoTag type="warning" :text="runtimeMode()" />
      <span class="app__tip">当前为独立启动（pnpm dev:order），与基座解耦</span>
    </header>

    <main class="app__body">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.app__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 18px;
  background: var(--demo-bg-card);
  border-bottom: 1px solid var(--demo-border-color);
}
.app__logo {
  font-size: 17px;
}
.app__bar code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  color: var(--demo-text-secondary);
}
.app__tip {
  margin-left: auto;
  font-size: 12px;
  color: var(--demo-text-secondary);
}
.app__body {
  flex: 1;
  padding: 16px 18px;
}
</style>
