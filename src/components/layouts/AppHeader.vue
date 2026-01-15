<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <img alt="App Logo" class="app-logo" src="@/assets/logo-white.png" />
    <nav class="app-nav">
      <RouterLink to="/">Products</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.app-logo {
  height: 48px;
  object-fit: contain;
}

.app-nav {
  display: flex;
  gap: 24px;
}

.app-nav a {
  color: var(--color-white);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
}

.app-nav a:hover,
.app-nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
