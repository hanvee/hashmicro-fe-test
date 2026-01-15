<template>
  <div v-if="!dismissed" :class="['alert', `alert-${variant}`]">
    <div class="alert-wrapper">
      <div class="alert-content">
        <div class="alert-icon-wrapper">
          <component :is="icons[variant]" class="alert-icon" />
        </div>
        <div class="alert-text">
          <h4 v-if="title" class="alert-title">
            {{ title }}
          </h4>
          <p v-if="message" class="alert-message">
            {{ message }}
          </p>
          <slot />
        </div>
      </div>
      <button
        v-if="closeable"
        @click="handleClose"
        type="button"
        class="alert-close"
        aria-label="Close alert"
      >
        <Close class="alert-close-icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Close, Warning } from '@/components/icons'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title: string
  message?: string
  closeable?: boolean
}

withDefaults(defineProps<AlertProps>(), {
  variant: 'info',
  message: '',
  closeable: false,
})

const emit = defineEmits<{
  close: []
}>()

const dismissed = ref(false)

const handleClose = () => {
  dismissed.value = true
  emit('close')
}
const icons = {
  success: Warning,
  error: Warning,
  warning: Warning,
  info: Warning,
}
</script>

<style scoped>
.alert {
  padding: 16px;
  border-left: 4px solid;
  border-radius: 8px;
}

.alert-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.alert-content {
  display: flex;
  flex: 1;
}

.alert-icon-wrapper {
  flex-shrink: 0;
}

.alert-icon {
  height: 20px;
  width: 20px;
}

.alert-text {
  margin-left: 12px;
}

.alert-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.alert-message {
  font-size: 14px;
  white-space: pre-line;
}

.alert-close {
  margin-left: 16px;
  flex-shrink: 0;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
}

.alert-close-icon {
  height: 16px;
  width: 16px;
}

/* Success variant */
.alert-success {
  border-color: #10b981;
  background-color: #d1fae5;
}

.alert-success .alert-icon {
  color: #10b981;
}

.alert-success .alert-title {
  color: #065f46;
}

.alert-success .alert-message {
  color: #047857;
}

.alert-success .alert-close {
  color: #6ee7b7;
}

.alert-success .alert-close:hover {
  color: #047857;
  background-color: #a7f3d0;
}

/* Error variant */
.alert-error {
  border-color: #ef4444;
  background-color: #fee2e2;
}

.alert-error .alert-icon {
  color: #ef4444;
}

.alert-error .alert-title {
  color: #991b1b;
}

.alert-error .alert-message {
  color: #b91c1c;
}

.alert-error .alert-close {
  color: #fca5a5;
}

.alert-error .alert-close:hover {
  color: #b91c1c;
  background-color: #fecaca;
}

/* Warning variant */
.alert-warning {
  border-color: #f59e0b;
  background-color: #fef3c7;
}

.alert-warning .alert-icon {
  color: #f59e0b;
}

.alert-warning .alert-title {
  color: #78350f;
}

.alert-warning .alert-message {
  color: #92400e;
}

.alert-warning .alert-close {
  color: #fcd34d;
}

.alert-warning .alert-close:hover {
  color: #92400e;
  background-color: #fde68a;
}

/* Info variant */
.alert-info {
  border-color: #3b82f6;
  background-color: #dbeafe;
}

.alert-info .alert-icon {
  color: #3b82f6;
}

.alert-info .alert-title {
  color: #1e3a8a;
}

.alert-info .alert-message {
  color: #1e40af;
}

.alert-info .alert-close {
  color: #93c5fd;
}

.alert-info .alert-close:hover {
  color: #1e40af;
  background-color: #bfdbfe;
}
</style
