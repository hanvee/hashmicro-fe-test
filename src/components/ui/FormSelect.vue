<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { ArrowDown } from '../icons'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    options: SelectOption[]
    label?: string
    placeholder?: string
    error?: string
    helpText?: string
    id?: string
    disabled?: boolean
    required?: boolean
    searchable?: boolean
    searchPlaceholder?: string
    emptyMessage?: string
  }>(),
  {
    disabled: false,
    required: false,
    searchable: true,
    placeholder: 'Select option...',
    searchPlaceholder: 'Search options...',
    emptyMessage: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}>()

const selectId = computed(() => props.id || `select-${Math.random().toString(36).substr(2, 9)}`)
const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const focusedIndex = ref(-1)

const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(
    (option) =>
      option.label.toLowerCase().includes(query) ||
      String(option.value).toLowerCase().includes(query),
  )
})

const displayText = computed(() => {
  return selectedOption.value?.label || props.placeholder
})

const isSelected = (option: SelectOption) => {
  return selectedOption.value?.value === option.value
}

const toggleDropdown = () => {
  if (props.disabled) return

  isOpen.value = !isOpen.value

  if (isOpen.value) {
    nextTick(() => {
      if (props.searchable && searchInput.value) {
        searchInput.value.focus()
      }
    })
    emit('focus', new FocusEvent('focus'))
  } else {
    emit('blur', new FocusEvent('blur'))
  }
}

const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
  focusedIndex.value = -1
}

const selectOption = (option: SelectOption) => {
  if (option.disabled) return

  emit('update:modelValue', option.value)
  emit('change', option.value)
  closeDropdown()
}

const selectFirstFiltered = () => {
  const firstOption = filteredOptions.value[0]
  if (firstOption && !firstOption.disabled) {
    selectOption(firstOption)
  }
}

const focusNextOption = () => {
  if (focusedIndex.value < filteredOptions.value.length - 1) {
    focusedIndex.value++
  }
}

const focusPreviousOption = () => {
  if (focusedIndex.value > 0) {
    focusedIndex.value--
  }
}

const handleClickOutside = (event: Event) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="form-group">
    <!-- Label -->
    <label v-if="label" :for="selectId" class="form-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <!-- Select Container -->
    <div class="select-wrapper" ref="selectRef">
      <!-- Trigger Button -->
      <div
        :id="selectId"
        class="form-select"
        :class="{
          'is-open': isOpen,
          'has-error': !!error,
          'is-disabled': disabled,
        }"
        role="button"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
        :aria-invalid="!!error"
        tabindex="0"
        @click="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.escape="closeDropdown"
      >
        <!-- Selected Content -->
        <div class="select-content">
          <span v-if="!selectedOption" class="select-placeholder">
            {{ placeholder }}
          </span>
          <span v-else class="select-value">
            {{ selectedOption.label }}
          </span>
        </div>

        <ArrowDown class="select-arrow" :class="{ 'is-open': isOpen }" />
      </div>

      <!-- Dropdown Menu -->
      <Transition
        name="dropdown"
        enter-active-class="dropdown-enter-active"
        enter-from-class="dropdown-enter-from"
        enter-to-class="dropdown-enter-to"
        leave-active-class="dropdown-leave-active"
        leave-from-class="dropdown-leave-from"
        leave-to-class="dropdown-leave-to"
      >
        <div v-if="isOpen" class="dropdown-menu">
          <!-- Search Input -->
          <div v-if="searchable" class="search-wrapper">
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              :placeholder="searchPlaceholder"
              class="search-input"
              @click.stop
              @keydown.escape="closeDropdown"
              @keydown.enter.prevent="selectFirstFiltered"
              @keydown.arrow-down.prevent="focusNextOption"
              @keydown.arrow-up.prevent="focusPreviousOption"
            />
          </div>

          <!-- Options List -->
          <div class="options-list">
            <!-- Empty state -->
            <div v-if="filteredOptions.length === 0" class="no-results">
              {{ emptyMessage || (searchQuery ? 'No options found' : 'No options available') }}
            </div>

            <!-- Options -->
            <div
              v-for="(option, index) in filteredOptions"
              :key="option.value"
              class="option-item"
              :class="{
                'is-selected': isSelected(option),
                'is-disabled': option.disabled,
                'is-focused': focusedIndex === index,
              }"
              role="option"
              :aria-selected="isSelected(option)"
              @click="selectOption(option)"
            >
              <span class="option-label">{{ option.label }}</span>

              <!-- Checkmark for selected items -->
              <svg
                v-if="isSelected(option)"
                class="checkmark"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="error-message">
      {{ error }}
    </p>

    <!-- Help Text -->
    <p v-if="helpText && !error" class="help-text">
      {{ helpText }}
    </p>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.required-mark {
  color: var(--color-error);
  margin-left: 4px;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.form-select {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 10px 12px;
  background-color: var(--color-white);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  outline: none;
}

.form-select:hover:not(.is-disabled) {
  border-color: var(--color-border-dark);
}

.form-select:focus,
.form-select.is-open {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 32, 96, 0.1);
}

.form-select.has-error {
  border-color: var(--color-error);
}

.form-select.has-error:focus,
.form-select.has-error.is-open {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.form-select.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--color-bg-secondary);
}

.select-content {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.select-placeholder {
  color: var(--color-text-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-value {
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-arrow {
  margin-left: 8px;
  flex-shrink: 0;
  color: var(--color-text-secondary);
  transition: transform 0.2s ease;
}

.select-arrow.is-open {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 9999;
  background: var(--color-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.search-wrapper {
  padding: 8px;
  border-bottom: 1px solid var(--color-border-light);
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-primary);
  background-color: var(--color-white);
  outline: none;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: var(--color-text-light);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 32, 96, 0.1);
}

.options-list {
  max-height: 240px;
  overflow-y: auto;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.option-item:first-child {
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.option-item:last-child {
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}

.option-item:hover:not(.is-disabled) {
  background-color: var(--color-bg-secondary);
}

.option-item.is-selected {
  background-color: rgba(0, 32, 96, 0.06);
  color: var(--color-primary);
}

.option-item.is-selected:hover {
  background-color: rgba(0, 32, 96, 0.1);
}

.option-item.is-focused:not(.is-disabled) {
  background-color: var(--color-bg-tertiary);
}

.option-item.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-item.is-disabled:hover {
  background-color: transparent;
}

.option-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkmark {
  flex-shrink: 0;
  margin-left: 8px;
  color: var(--color-primary);
}

.no-results {
  padding: 16px 12px;
  text-align: center;
  font-size: 14px;
  color: var(--color-text-light);
}

/* Error Message */
.error-message {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-error);
}

/* Help Text */
.help-text {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* Dropdown Transitions */
.dropdown-enter-active {
  transition: all 0.1s ease-out;
}

.dropdown-leave-active {
  transition: all 0.075s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.dropdown-enter-to {
  opacity: 1;
  transform: scale(1);
}

.dropdown-leave-from {
  opacity: 1;
  transform: scale(1);
}

.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Scrollbar Styling */
.options-list::-webkit-scrollbar {
  width: 6px;
}

.options-list::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

.options-list::-webkit-scrollbar-thumb {
  background: var(--color-border-medium);
  border-radius: 3px;
}

.options-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-dark);
}
</style>
