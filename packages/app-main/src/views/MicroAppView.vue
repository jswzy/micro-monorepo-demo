<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import WujieVue from 'wujie-vue3'
import { MICRO_APPS } from '@demo/shared-utils'
import { DemoEmpty } from '@demo/ui-package'

const route = useRoute()

const microApp = computed(() => MICRO_APPS.find((app) => app.name === route.meta.microApp))
</script>

<template>
  <div class="micro-container">
    <WujieVue
      v-if="microApp"
      :key="microApp.name"
      :name="microApp.name"
      :url="microApp.url"
      width="100%"
      height="100%"
      :sync="false"
      :alive="true"
      :props="{ from: 'app-main', title: microApp.title }"
    />
    <DemoEmpty v-else text="未找到对应的微应用注册信息" />
  </div>
</template>

<style scoped>
.micro-container {
  height: 100%;
  border-radius: var(--demo-radius-md);
  overflow: hidden;
  background: var(--demo-bg-card);
  border: 1px solid var(--demo-border-color);
}
</style>
