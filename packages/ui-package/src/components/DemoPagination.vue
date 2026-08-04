<script setup lang="ts">
import { computed } from 'vue'
import DemoButton from './DemoButton.vue'

const props = defineProps<{ page: number; pageSize: number; total: number }>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

function go(delta: number) {
  const next = props.page + delta
  if (next < 1 || next > pageCount.value) return
  emit('update:page', next)
}
</script>

<template>
  <div class="demo-pagination">
    <span class="demo-pagination__info">
      共 {{ total }} 条 · 第 {{ page }} / {{ pageCount }} 页
    </span>
    <div class="demo-pagination__ctrl">
      <DemoButton size="small" type="info" plain :disabled="page <= 1" @click="go(-1)">
        上一页
      </DemoButton>
      <DemoButton size="small" type="info" plain :disabled="page >= pageCount" @click="go(1)">
        下一页
      </DemoButton>
    </div>
  </div>
</template>

<style scoped>
.demo-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-family: var(--demo-font-family);
}
.demo-pagination__info {
  font-size: 12px;
  color: var(--demo-text-secondary);
}
.demo-pagination__ctrl {
  display: flex;
  gap: 8px;
}
</style>
