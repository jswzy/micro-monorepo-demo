<script setup lang="ts">
withDefaults(defineProps<{ title?: string; subtitle?: string; bordered?: boolean }>(), {
  title: '',
  subtitle: '',
  bordered: true,
})
</script>

<template>
  <section class="demo-card" :class="{ 'is-bordered': bordered }">
    <header v-if="title || subtitle || $slots.extra" class="demo-card__head">
      <div class="demo-card__title-wrap">
        <h3 v-if="title" class="demo-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="demo-card__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.extra" class="demo-card__extra"><slot name="extra" /></div>
    </header>
    <div class="demo-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="demo-card__foot"><slot name="footer" /></footer>
  </section>
</template>

<style scoped>
.demo-card {
  background: var(--demo-bg-card);
  border-radius: var(--demo-radius-md);
  box-shadow: var(--demo-shadow-card);
  font-family: var(--demo-font-family);
  overflow: hidden;
}
.is-bordered {
  border: 1px solid var(--demo-border-color);
}
.demo-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--demo-border-color);
}
.demo-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--demo-text-primary);
}
.demo-card__subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--demo-text-secondary);
}
.demo-card__body {
  padding: 16px 18px;
}
.demo-card__foot {
  padding: 12px 18px;
  border-top: 1px solid var(--demo-border-color);
  background: #fafbfc;
}
</style>
