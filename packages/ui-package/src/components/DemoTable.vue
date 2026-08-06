<script setup lang="ts" generic="T extends object">
import DemoEmpty from './DemoEmpty.vue'
import type { TableColumn } from '../types'

defineProps<{
  columns: TableColumn<T>[]
  data: T[]
  rowKey: Extract<keyof T, string>
  loading?: boolean
  emptyText?: string
}>()

const emit = defineEmits<{ rowClick: [row: T] }>()

function cellText(row: T, key: string): string {
  const value = (row as Record<string, unknown>)[key]
  return value === null || value === undefined ? '-' : String(value)
}
</script>

<template>
  <div class="demo-table">
    <table>
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ width: col.width, textAlign: col.align ?? 'left' }"
          >
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody v-if="!loading && data.length">
        <tr v-for="row in data" :key="String(row[rowKey])" @click="emit('rowClick', row)">
          <td
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align ?? 'left' }"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="(row as Record<string, unknown>)[(col.field ?? col.key)]">
              {{ cellText(row, col.field ?? col.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="demo-table__loading">加载中…</div>
    <DemoEmpty v-else-if="!data.length" :text="emptyText ?? '暂无数据'" />
  </div>
</template>

<style scoped>
.demo-table {
  font-family: var(--demo-font-family);
  width: 100%;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
th {
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--demo-text-secondary);
  background: #f7f9fc;
  border-bottom: 1px solid var(--demo-border-color);
  white-space: nowrap;
}
td {
  padding: 12px;
  color: var(--demo-text-regular);
  border-bottom: 1px solid var(--demo-border-color);
}
tbody tr {
  transition: background-color 0.12s ease;
}
tbody tr:hover {
  background: #f9fbff;
}
.demo-table__loading {
  padding: 36px 0;
  text-align: center;
  font-size: 13px;
  color: var(--demo-text-secondary);
}
</style>
