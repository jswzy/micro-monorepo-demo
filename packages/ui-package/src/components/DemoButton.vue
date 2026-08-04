<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonSize, ThemeType } from '../types'

const props = withDefaults(
  defineProps<{
    type?: ThemeType
    size?: ButtonSize
    plain?: boolean
    disabled?: boolean
    block?: boolean
  }>(),
  {
    type: 'primary',
    size: 'medium',
    plain: false,
    disabled: false,
    block: false,
  },
)

const emit = defineEmits<{ click: [evt: MouseEvent] }>()

const classes = computed(() => [
  'demo-btn',
  `demo-btn--${props.type}`,
  `demo-btn--${props.size}`,
  { 'is-plain': props.plain, 'is-block': props.block },
])

function onClick(evt: MouseEvent) {
  if (props.disabled) return
  emit('click', evt)
}
</script>

<template>
  <button :class="classes" :disabled="disabled" type="button" @click="onClick">
    <slot />
  </button>
</template>

<style scoped>
.demo-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: var(--demo-radius-sm);
  font-family: var(--demo-font-family);
  font-weight: 500;
  cursor: pointer;
  transition:
    filter 0.15s ease,
    background-color 0.15s ease;
  white-space: nowrap;
}
.demo-btn:hover:not(:disabled) {
  filter: brightness(0.94);
}
.demo-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.is-block {
  width: 100%;
}

.demo-btn--small {
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
}
.demo-btn--medium {
  height: 34px;
  padding: 0 16px;
  font-size: 13px;
}
.demo-btn--large {
  height: 42px;
  padding: 0 22px;
  font-size: 15px;
}

.demo-btn--primary {
  background: var(--demo-color-primary);
  color: #fff;
}
.demo-btn--success {
  background: var(--demo-color-success);
  color: #fff;
}
.demo-btn--warning {
  background: var(--demo-color-warning);
  color: #fff;
}
.demo-btn--danger {
  background: var(--demo-color-danger);
  color: #fff;
}
.demo-btn--info {
  background: var(--demo-color-info);
  color: #fff;
}

.demo-btn--primary.is-plain {
  background: var(--demo-color-primary-weak);
  color: var(--demo-color-primary);
  border-color: var(--demo-color-primary);
}
.demo-btn--success.is-plain {
  background: var(--demo-color-success-weak);
  color: var(--demo-color-success);
  border-color: var(--demo-color-success);
}
.demo-btn--warning.is-plain {
  background: var(--demo-color-warning-weak);
  color: var(--demo-color-warning);
  border-color: var(--demo-color-warning);
}
.demo-btn--danger.is-plain {
  background: var(--demo-color-danger-weak);
  color: var(--demo-color-danger);
  border-color: var(--demo-color-danger);
}
.demo-btn--info.is-plain {
  background: var(--demo-color-info-weak);
  color: var(--demo-color-info);
  border-color: var(--demo-border-color);
}
</style>
