<script setup lang="ts">
// 组件库依赖域内工具包：演示 packages 之间的内部依赖关系
import { debounce } from '@demo/shared-utils'

const props = withDefaults(
  defineProps<{ modelValue: string; placeholder?: string; delay?: number }>(),
  { placeholder: '输入关键字搜索', delay: 300 },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const emitSearch = debounce((value: string) => emit('search', value), props.delay)

function onInput(evt: Event) {
  const value = (evt.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emitSearch(value)
}
</script>

<template>
  <label class="demo-search">
    <span class="demo-search__icon">🔍</span>
    <input
      class="demo-search__input"
      :value="props.modelValue"
      :placeholder="placeholder"
      @input="onInput"
    />
  </label>
</template>

<style scoped>
.demo-search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  min-width: 240px;
  background: #fff;
  border: 1px solid var(--demo-border-color);
  border-radius: var(--demo-radius-sm);
  font-family: var(--demo-font-family);
}
.demo-search:focus-within {
  border-color: var(--demo-color-primary);
  box-shadow: 0 0 0 3px var(--demo-color-primary-weak);
}
.demo-search__icon {
  font-size: 13px;
  opacity: 0.6;
}
.demo-search__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  color: var(--demo-text-primary);
  background: transparent;
}
</style>
