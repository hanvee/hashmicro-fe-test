<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowDown, User } from '@/components/icons'
import { useToast } from '@/composables/useToast'
import router from '@/router'

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const toast = useToast()

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

const handleLogout = () => {
  toast.success('You have been logged out')
  isDropdownOpen.value = false
  router.push('/')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <img alt="App Logo" class="app-logo" src="@/assets/logo-white.png" />
    </div>

    <div class="user-menu" ref="dropdownRef" @click="toggleDropdown">
      <User class="user-icon" /> 
      <span class="user-name">John Doe</span>
      <ArrowDown class="user-arrow" :class="{ rotated: isDropdownOpen }" />

      <div v-if="isDropdownOpen" class="dropdown-content">
        <button @click="handleLogout" class="dropdown-item">Sign Out</button>
      </div>
    </div>
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

.header-left {
  display: flex;
  align-items: center;
  gap: 48px;
}

.app-logo {
  height: 48px;
  object-fit: contain;
}

.app-nav {
  display: flex;
  gap: 24px;
  align-items: center;
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

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--color-white);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
  user-select: none;
}

.user-menu:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-name {
  font-weight: 600;
  font-size: 14px;
}

.user-icon {
  width: 18px;
  height: 18px;
}

.user-arrow {
  transition: transform 0.2s ease;
}

.user-arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 160px;
  padding: 8px 0;
  overflow: hidden;
  animation: fadeIn 0.1s ease-out;
}

.dropdown-item {
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: none;
  border: none;
  font-size: 14px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
}

.dropdown-item:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-error);
}

@media (max-width: 768px) {
  .user-name {
    display: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
