<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DOMAIN, MICRO_APPS, isDev } from '@demo/shared-utils'
import { DemoTag } from '@demo/ui-package'

const route = useRoute()

const menus = computed(() => [
  { path: '/dashboard', title: '域工作台', icon: '🏠', standalone: '' },
  ...MICRO_APPS.map((app) => ({
    path: app.path,
    title: app.title,
    icon: app.icon ?? '📁',
    standalone: app.url,
  })),
])

const currentTitle = computed(() => (route.meta.title as string) ?? '域工作台')
</script>

<template>
  <div class="layout">
    <aside class="layout__aside">
      <div class="brand">
        <span class="brand__logo">⬢</span>
        <div>
          <strong>交易业务域</strong>
          <small>micro-monorepo</small>
        </div>
      </div>

      <nav class="menu">
        <RouterLink
          v-for="menu in menus"
          :key="menu.path"
          class="menu__item"
          :class="{ 'is-active': route.path === menu.path }"
          :to="menu.path"
        >
          <span class="menu__icon">{{ menu.icon }}</span>
          <span class="menu__text">{{ menu.title }}</span>
        </RouterLink>
      </nav>

      <div class="aside-foot">
        <p class="aside-foot__title">子应用独立入口</p>
        <a
          v-for="app in MICRO_APPS"
          :key="app.name"
          class="aside-foot__link"
          :href="app.url"
          target="_blank"
          rel="noreferrer"
        >
          {{ app.name }} ↗
        </a>
      </div>
    </aside>

    <div class="layout__main">
      <header class="topbar">
        <div class="topbar__left">
          <h1>{{ currentTitle }}</h1>
          <DemoTag type="primary" :text="`domain: ${DOMAIN}`" />
          <DemoTag :type="isDev() ? 'warning' : 'success'" :text="isDev() ? 'development' : 'production'" />
        </div>
        <div class="topbar__right">
          <span class="topbar__user">管理员 · admin</span>
        </div>
      </header>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100%;
}
.layout__aside {
  width: 216px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #101828;
  color: #cdd5e0;
  padding: 18px 12px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 18px;
}
.brand__logo {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--demo-color-primary);
  color: #fff;
  font-size: 15px;
}
.brand strong {
  display: block;
  font-size: 14px;
  color: #fff;
}
.brand small {
  display: block;
  font-size: 11px;
  color: #8f9bb3;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--demo-radius-sm);
  font-size: 13.5px;
  transition: background-color 0.15s ease;
}
.menu__item:hover {
  background: rgba(255, 255, 255, 0.06);
}
.menu__item.is-active {
  background: var(--demo-color-primary);
  color: #fff;
}
.aside-foot {
  margin-top: auto;
  padding: 12px 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.aside-foot__title {
  margin: 0 0 6px;
  font-size: 11px;
  color: #6e7a91;
}
.aside-foot__link {
  display: block;
  font-size: 12px;
  color: #8f9bb3;
  padding: 3px 0;
}
.aside-foot__link:hover {
  color: #fff;
}

.layout__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.topbar {
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--demo-bg-card);
  border-bottom: 1px solid var(--demo-border-color);
}
.topbar__left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.topbar__left h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.topbar__user {
  font-size: 13px;
  color: var(--demo-text-secondary);
}
.content {
  flex: 1;
  min-height: 0;
  padding: 18px 20px;
  overflow: auto;
}
</style>
