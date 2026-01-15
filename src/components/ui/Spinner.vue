<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white' | 'accent'
  text?: string
  show?: boolean
  centered?: boolean
  fullHeight?: boolean
  overlay?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  show: true,
  centered: false,
  fullHeight: false,
  overlay: false,
})
</script>

<template>
  <div v-if="show" class="spinner-container" :class="{
    'spinner-container--overlay': overlay,
    'spinner-container--centered': centered,
    'spinner-container--full-height': fullHeight
  }">
    <div class="spinner" :class="[
      `spinner--${size}`,
      `spinner--${variant}`
    ]"></div>
    <p v-if="text" class="spinner-text" :class="[
      `spinner-text--${size}`,
      { 'spinner-text--white': variant === 'white' }
    ]">{{ text }}</p>
  </div>
</template>

<style scoped>
.spinner-container {
  text-align: center;
}

.spinner-container--overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.spinner-container--centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner-container--full-height {
  height: 16rem;
}

.spinner {
  border-radius: 50%;
  border-style: solid;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Size variants */
.spinner--xs {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.spinner--sm {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.spinner--md {
  width: 32px;
  height: 32px;
  border-width: 2px;
}

.spinner--lg {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

.spinner--xl {
  width: 64px;
  height: 64px;
  border-width: 4px;
}

/* Color variants */
.spinner--primary {
  border-color: var(--color-primary);
  border-top-color: transparent;
}

.spinner--secondary {
  border-color: var(--color-secondary);
  border-top-color: transparent;
}

.spinner--accent {
  border-color: var(--color-accent);
  border-top-color: transparent;
}

.spinner--white {
  border-color: var(--color-white);
  border-top-color: transparent;
}

/* Text styling */
.spinner-text {
  color: var(--color-text-secondary);
}

.spinner-text--white {
  color: var(--color-white);
}

.spinner-text--xs,
.spinner-text--sm {
  font-size: 12px;
  margin-top: 4px;
}

.spinner-text--md {
  font-size: 14px;
  margin-top: 8px;
}

.spinner-text--lg {
  font-size: 16px;
  margin-top: 12px;
}

.spinner-text--xl {
  font-size: 18px;
  margin-top: 16px;
}
</style>
