<script setup lang="ts">
import type { ThemeType } from '../types'

withDefaults(defineProps<{ type?: ThemeType; text?: string }>(), { type: 'info', text: '' })
</script>

<template>
  <span class="demo-tag" :class="`demo-tag--${type}`">
    <i class="demo-tag__dot" />
    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
.demo-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  font-family: var(--demo-font-family);
  white-space: nowrap;
}
.demo-tag__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.demo-tag--primary {
  background: var(--demo-color-primary-weak);
  color: var(--demo-color-primary);
}
.demo-tag--success {
  background: var(--demo-color-success-weak);
  color: var(--demo-color-success);
}
.demo-tag--warning {
  background: var(--demo-color-warning-weak);
  color: var(--demo-color-warning);
}
.demo-tag--danger {
  background: var(--demo-color-danger-weak);
  color: var(--demo-color-danger);
}
.demo-tag--info {
  background: var(--demo-color-info-weak);
  color: var(--demo-color-info);
}
</style>
