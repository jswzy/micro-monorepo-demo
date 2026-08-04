<script setup lang="ts">
withDefaults(defineProps<{ text?: string }>(), { text: '暂无数据' })
</script>

<template>
  <div class="demo-empty">
    <div class="demo-empty__icon">🗂️</div>
    <p class="demo-empty__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.demo-empty {
  padding: 40px 0;
  text-align: center;
  font-family: var(--demo-font-family);
}
.demo-empty__icon {
  font-size: 30px;
  opacity: 0.65;
}
.demo-empty__text {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--demo-text-secondary);
}
</style>
