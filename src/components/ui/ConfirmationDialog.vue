<script setup lang="ts">
import { Modal, Button } from '@/components/ui'
import { Warning } from '@/components/icons'

export interface DeleteConfirmationDialogProps {
  isOpen: boolean
  title?: string
  message?: string
  itemName?: string
  itemLabel?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

interface DeleteConfirmationDialogEmits {
  confirm: []
  cancel: []
  close: []
}

withDefaults(defineProps<DeleteConfirmationDialogProps>(), {
  title: '',
  message: '',
  itemName: '',
  itemLabel: '',
  confirmText: '',
  cancelText: '',
  isLoading: false,
})

const emit = defineEmits<DeleteConfirmationDialogEmits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}
</script>

<template>
  <Modal v-if="isOpen" :full-screen-backdrop="true" @close="handleCancel">
    <template #body>
      <div class="dialog-container">
        <!-- Icon -->
        <div class="icon-wrapper">
          <Warning class="icon" />
        </div>

        <!-- Title -->
        <h3 class="dialog-title">
          {{ title || 'Confirm Deletion' }}
        </h3>

        <!-- Message -->
        <p class="dialog-message">
          {{
            message || 'Are you sure you want to delete this item? This action cannot be undone.'
          }}
        </p>

        <!-- Item details (optional) -->
        <div v-if="itemName" class="item-details">
          <p class="item-text">
            <span class="item-label">{{ itemLabel || 'Item' }}:</span>
            <span class="item-name">{{ itemName }}</span>
          </p>
        </div>

        <!-- Action buttons -->
        <div class="button-group">
          <Button variant="outline" size="md" :disabled="isLoading" @click="handleCancel">
            {{ cancelText || 'Cancel' }}
          </Button>

          <Button variant="danger" size="md" :is-loading="isLoading" @click="handleConfirm">
            {{ confirmText || 'Delete' }}
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.dialog-container {
  position: relative;
  width: 100%;
  max-width: 448px;
  margin: 0 auto;
  background-color: var(--color-white);
  border-radius: 12px;
  box-shadow: var(--shadow-xl);
  padding: 24px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 50%;
}

.icon {
  width: 24px;
  height: 24px;
  color: var(--color-error);
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 8px;
}

.dialog-message {
  font-size: 14px;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
}

.item-details {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: 12px;
  margin-bottom: 24px;
}

.item-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  text-align: center;
}

.item-label {
  font-weight: 500;
}

.item-name {
  color: var(--color-text-primary);
  font-weight: 600;
  margin-left: 4px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.button-group > * {
  flex: 1;
}
</style>
