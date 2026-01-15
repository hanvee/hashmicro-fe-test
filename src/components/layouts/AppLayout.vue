<script setup lang="ts">
import { AppHeader } from '@/components/layouts'
import Breadcrumb from '@/components/ui/Breadcrumb.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />

    <main class="main-content">
      <div class="content-container">
        <Breadcrumb />
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-secondary);
}

.main-content {
  flex: 1;
  width: 100%;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
}

/* Adjust padding for small screens */
@media (max-width: 640px) {
  .content-container {
    padding: 24px 16px;
  }
}
</style>
