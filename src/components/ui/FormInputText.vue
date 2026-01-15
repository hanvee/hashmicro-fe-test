<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number | undefined
    label?: string
    placeholder?: string
    type?: 'text' | 'password' | 'email' | 'number'
    error?: string
    id?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    type: 'text',
    modelValue: '',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="form-group" :class="{ 'has-error': !!error, 'is-disabled': disabled }">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }} <span v-if="required" class="required-mark">*</span>
    </label>

    <div class="input-wrapper">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="!!error"
        class="form-input"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <div v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix"></slot>
      </div>
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
  font-family: inherit;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.required-mark {
  color: var(--color-error);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 10px 12px;
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-sm, 4px);
  font-size: 14px;
  color: var(--color-text-primary);
  background-color: var(--color-white);
  transition: all 0.2s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary); /* Navy */
  box-shadow: 0 0 0 3px rgba(0, 32, 96, 0.1);
}

.form-input:disabled {
  background-color: var(--color-bg-secondary);
  cursor: not-allowed;
  color: var(--color-text-light);
}

.form-input::placeholder {
  color: var(--color-text-light);
}

/* Error State */
.has-error .form-input {
  border-color: var(--color-error);
}

.has-error .form-input:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.error-message {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 2px;
}
</style>
