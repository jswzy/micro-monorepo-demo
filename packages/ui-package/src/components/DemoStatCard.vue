<script setup lang="ts">
import type { ThemeType } from '../types'

withDefaults(
  defineProps<{ label: string; value: string | number; hint?: string; accent?: ThemeType }>(),
  { hint: '', accent: 'primary' },
)
</script>

<template>
  <div class="demo-stat" :class="`demo-stat--${accent}`">
    <span class="demo-stat__label">{{ label }}</span>
    <strong class="demo-stat__value">{{ value }}</strong>
    <span v-if="hint" class="demo-stat__hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.demo-stat {
  position: relative;
  padding: 16px 18px 16px 22px;
  background: var(--demo-bg-card);
  border: 1px solid var(--demo-border-color);
  border-radius: var(--demo-radius-md);
  font-family: var(--demo-font-family);
  overflow: hidden;
}
.demo-stat::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}
.demo-stat--primary::before {
  background: var(--demo-color-primary);
}
.demo-stat--success::before {
  background: var(--demo-color-success);
}
.demo-stat--warning::before {
  background: var(--demo-color-warning);
}
.demo-stat--danger::before {
  background: var(--demo-color-danger);
}
.demo-stat--info::before {
  background: var(--demo-color-info);
}
.demo-stat__label {
  display: block;
  font-size: 12px;
  color: var(--demo-text-secondary);
}
.demo-stat__value {
  display: block;
  margin-top: 6px;
  font-size: 24px;
  font-weight: 650;
  color: var(--demo-text-primary);
  letter-spacing: -0.02em;
}
.demo-stat__hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--demo-text-secondary);
}
</style>
