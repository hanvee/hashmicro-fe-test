<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Spinner from './Spinner.vue'

const props = withDefaults(
  defineProps<{
    variant?:
      | 'primary'
      | 'accent'
      | 'secondary'
      | 'outline'
      | 'ghost'
      | 'danger'
      | 'ghost-accent'
      | 'ghost-danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    isLoading?: boolean
    href?: string
    to?: string
    block?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    isLoading: false,
    block: false,
    type: 'button',
  },
)

const componentTag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return RouterLink
  return 'button'
})

const classes = computed(() => {
  return [
    'ui-button',
    `ui-button--${props.variant}`,
    `ui-button--${props.size}`,
    { 'ui-button--block': props.block },
    { 'ui-button--disabled': props.disabled || props.isLoading },
  ]
})

const spinnerSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'xs'
    case 'lg':
      return 'sm'
    default:
      return 'xs'
  }
})

const spinnerVariant = computed(() => {
  if (props.variant === 'outline' || props.variant.startsWith('ghost')) {
    return 'primary'
  }
  return 'white'
})
</script>

<template>
  <component
    :is="componentTag"
    :href="href"
    :to="to"
    :type="componentTag === 'button' ? type : undefined"
    :class="classes"
    :disabled="(disabled || isLoading) && componentTag === 'button'"
  >
    <Spinner
      v-if="isLoading"
      :size="spinnerSize"
      :variant="spinnerVariant"
      :show="true"
      class="button-spinner"
    />
    <slot></slot>
  </component>
</template>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm, 4px);
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  font-family: inherit;
  line-height: 1.5;
}

.ui-button:disabled,
.ui-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.ui-button--block {
  display: flex;
  width: 100%;
}

/* Sizes */
.ui-button--sm {
  padding: 6px 12px;
  font-size: 13px;
}

.ui-button--md {
  padding: 10px 20px;
  font-size: 14px;
}

.ui-button--lg {
  padding: 12px 24px;
  font-size: 16px;
}

/* Variants */

/* Primary (Navy) */
.ui-button--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}
.ui-button--primary:hover {
  filter: brightness(1.2);
  box-shadow: var(--shadow-sm);
}

/* Secondary (Red) */
.ui-button--secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
}
.ui-button--secondary:hover {
  filter: brightness(1.1);
  box-shadow: var(--shadow-sm);
}

/* Accent (Orange) */
.ui-button--accent {
  background-color: var(--color-accent);
  color: var(--color-white);
}
.ui-button--accent:hover {
  filter: brightness(1.1);
  box-shadow: var(--shadow-sm);
}

/* Outline (Border with Primary Color) */
.ui-button--outline {
  background-color: transparent;
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.ui-button--outline:hover {
  background-color: rgba(0, 32, 96, 0.05); /* very light navy tint */
}

/* Ghost (Text only) */
.ui-button--ghost {
  background-color: transparent;
  color: var(--color-text-primary);
  border-color: transparent;
}
.ui-button--ghost:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Danger (Error Red) */
.ui-button--danger {
  background-color: var(--color-error);
  color: var(--color-white);
}
.ui-button--danger:hover {
  background-color: #d32f2f;
  box-shadow: var(--shadow-sm);
}

/* Ghost Accent (Transparent with Orange text) */
.ui-button--ghost-accent {
  background-color: transparent;
  color: var(--color-accent);
  border-color: transparent;
}
.ui-button--ghost-accent:hover {
  background-color: rgba(242, 126, 0, 0.1);
}

/* Ghost Danger (Transparent with Red text) */
.ui-button--ghost-danger {
  background-color: transparent;
  color: var(--color-secondary);
  border-color: transparent;
}
.ui-button--ghost-danger:hover {
  background-color: rgba(212, 46, 18, 0.1);
}

.button-spinner {
  margin-right: 8px;
}
</style>
