<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: File | null
    label?: string
    accept?: string
    error?: string
    id?: string
    disabled?: boolean
    required?: boolean
    placeholder?: string
  }>(),
  {
    accept: '*',
    disabled: false,
    required: false,
    placeholder: 'No file selected',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void
  (e: 'change', event: Event): void
}>()

const inputId = computed(() => props.id || `file-input-${Math.random().toString(36).substr(2, 9)}`)
const fileName = ref<string>('')

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null

  if (file) {
    fileName.value = file.name
    emit('update:modelValue', file)
  } else {
    fileName.value = ''
    emit('update:modelValue', null)
  }
  emit('change', event)
}
</script>

<template>
  <div class="form-group" :class="{ 'has-error': !!error, 'is-disabled': disabled }">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }} <span v-if="required" class="required-mark">*</span>
    </label>

    <div class="file-input-wrapper">
      <input
        :id="inputId"
        type="file"
        :accept="accept"
        :disabled="disabled"
        :aria-invalid="!!error"
        class="file-input-hidden"
        @change="handleFileChange"
      />

      <label :for="inputId" class="file-input-fake">
        <span class="file-input-button">Choose File</span>
        <span class="file-input-text">{{ fileName || placeholder }}</span>
      </label>
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-bottom: 12px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.required-mark {
  color: var(--color-error);
}

.file-input-wrapper {
  position: relative;
  width: 100%;
}

.file-input-hidden {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
}

.file-input-fake {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-sm, 4px);
  background-color: var(--color-white);
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.file-input-hidden:focus + .file-input-fake {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 32, 96, 0.1);
}

.file-input-button {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border-right: 1px solid var(--color-border-medium);
  white-space: nowrap;
}

.file-input-text {
  padding: 10px 12px;
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Disabled State */
.is-disabled .file-input-fake {
  background-color: var(--color-bg-secondary);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Error State */
.has-error .file-input-fake {
  border-color: var(--color-error);
}

.has-error .file-input-button {
  color: var(--color-error);
}
.error-message {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 2px;
}
</style>
