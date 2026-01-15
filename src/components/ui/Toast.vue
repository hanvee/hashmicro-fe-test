<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { Close } from '@/components/icons'

const { toasts, remove } = useToast()
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        @click="remove(toast.id)"
      >
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click.stop="remove(toast.id)">
          <Close class="toast-close-icon" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background-color: var(--color-white);
  box-shadow: var(--shadow-lg);
  min-width: 300px;
  max-width: 400px;
  cursor: pointer;
  pointer-events: auto;
  border-left: 4px solid;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.toast-close-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
}

/* Toast variants */
.toast-success {
  border-left-color: var(--color-success);
  color: var(--color-success);
}

.toast-success .toast-message {
  color: var(--color-text-primary);
}

.toast-error {
  border-left-color: var(--color-error);
  color: var(--color-error);
}

.toast-error .toast-message {
  color: var(--color-text-primary);
}

.toast-warning {
  border-left-color: var(--color-warning);
  color: var(--color-warning);
}

.toast-warning .toast-message {
  color: var(--color-text-primary);
}

.toast-info {
  border-left-color: var(--color-info);
  color: var(--color-info);
}

.toast-info .toast-message {
  color: var(--color-text-primary);
}

/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .toast-container {
    top: 16px;
    right: 16px;
    left: 16px;
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>
