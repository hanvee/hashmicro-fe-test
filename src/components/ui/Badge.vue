<script setup lang="ts">
import { computed } from 'vue'

type BadgeVariant = 'light' | 'solid'
type BadgeSize = 'sm' | 'md'
type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'accent' | 'secondary'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  color?: BadgeColor
  startIcon?: object
  endIcon?: object
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'light',
  color: 'primary',
  size: 'md',
})

const badgeClass = computed(() => {
  return ['badge', `badge-${props.variant}`, `badge-${props.color}`, `badge-${props.size}`]
})
</script>

<template>
  <span :class="badgeClass">
    <span v-if="startIcon" class="badge-icon">
      <component :is="startIcon" />
    </span>
    <slot></slot>
    <span v-if="endIcon" class="badge-icon">
      <component :is="endIcon" />
    </span>
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
}

/* Sizes */
.badge-sm {
  padding: 2px 8px;
  font-size: 12px;
}

.badge-md {
  padding: 4px 12px;
  font-size: 13px;
}

/* Light Variant */
.badge-light.badge-primary {
  background-color: rgba(0, 32, 96, 0.1);
  color: var(--color-primary);
}

.badge-light.badge-success {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.badge-light.badge-error {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--color-error);
}

.badge-light.badge-warning {
  background-color: rgba(255, 193, 7, 0.1);
  color: var(--color-warning);
}

.badge-light.badge-info {
  background-color: rgba(33, 150, 243, 0.1);
  color: var(--color-info);
}

.badge-light.badge-accent {
  background-color: rgba(242, 126, 0, 0.1);
  color: var(--color-accent);
}

.badge-light.badge-secondary {
  background-color: rgba(212, 46, 18, 0.1);
  color: var(--color-secondary);
}

/* Solid Variant */
.badge-solid.badge-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.badge-solid.badge-success {
  background-color: var(--color-success);
  color: var(--color-white);
}

.badge-solid.badge-error {
  background-color: var(--color-error);
  color: var(--color-white);
}

.badge-solid.badge-warning {
  background-color: var(--color-warning);
  color: var(--color-white);
}

.badge-solid.badge-info {
  background-color: var(--color-info);
  color: var(--color-white);
}

.badge-solid.badge-accent {
  background-color: var(--color-accent);
  color: var(--color-white);
}

.badge-solid.badge-secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
}

.badge-icon {
  display: inline-flex;
  align-items: center;
}
</style>
