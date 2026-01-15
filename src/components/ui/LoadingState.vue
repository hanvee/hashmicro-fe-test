<script setup lang="ts">
import Spinner from './Spinner.vue';

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'accent';
  text?: string;
  show?: boolean;
  overlay?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'lg',
  variant: 'primary',
  text: 'Loading...',
  show: true,
  overlay: false
});
</script>

<template>
  <div v-if="show" class="loading-state" :class="{
    'loading-state--overlay': overlay
  }">
    <Spinner 
      :size="size" 
      :variant="variant" 
      :text="text"
      centered
    />
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 16rem;
}

.loading-state--overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.75);
  z-index: 50;
  min-height: unset;
}
</style>