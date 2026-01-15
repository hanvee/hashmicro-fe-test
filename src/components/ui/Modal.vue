<script setup lang="ts">
interface ModalProps {
  fullScreenBackdrop?: boolean
}

defineProps<ModalProps>()
defineEmits(['close'])

defineSlots<{
  body?(): void
}>()
</script>

<template>
  <div class="modal-container">
    <div
      v-if="fullScreenBackdrop"
      class="modal-backdrop"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>
    <slot name="body"></slot>
  </div>
</template>

<style scoped>
.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  z-index: 99999;
  position: fixed;
  inset: 0;
}

.modal-backdrop {
  position: fixed;
  height: 100%;
  width: 100%;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: -1;
}
</style>
