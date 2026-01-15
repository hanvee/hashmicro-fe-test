<script setup lang="ts">
import { ref, watch } from 'vue'
import { Upload, Close } from '@/components/icons'
import { Button } from '@/components/ui'

const props = defineProps<{
  modelValue?: File | null
  previewUrl?: string
  label?: string
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const localPreview = ref<string | null>(null)

// Initialize local preview from props
watch(
  () => props.previewUrl,
  (newUrl) => {
    if (!props.modelValue && newUrl) {
      localPreview.value = newUrl
    }
  },
  { immediate: true },
)

// Create object URL when a new file is selected
watch(
  () => props.modelValue,
  (newFile) => {
    if (newFile) {
      if (localPreview.value && !localPreview.value.startsWith('http')) {
        URL.revokeObjectURL(localPreview.value)
      }
      localPreview.value = URL.createObjectURL(newFile)
    } else if (props.previewUrl) {
      localPreview.value = props.previewUrl
    } else {
      localPreview.value = null
    }
  },
)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) validateAndEmit(file)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (file) validateAndEmit(file)
  }
}

const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const removeFile = () => {
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  localPreview.value = null
}

const validateAndEmit = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    alert('Invalid file type. Please upload PNG, JPG, WebP, or SVG.')
    return
  }

  if (file.size > maxSize) {
    alert('File too large. Max size is 10MB.')
    return
  }

  emit('update:modelValue', file)
}
</script>

<template>
  <div class="form-item">
    <label v-if="label" class="form-label">{{ label }}</label>

    <div
      class="upload-container"
      :class="{ 'is-dragging': isDragging, 'has-error': !!error }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        class="hidden-input"
        @change="handleFileSelect"
      />

      <div v-if="localPreview" class="preview-mode">
        <img :src="localPreview" alt="Preview" class="image-preview" />
        <div class="preview-overlay">
          <Button variant="danger" size="sm" @click.stop="removeFile">
            <Close class="preview-close-icon"/>
          </Button>
        </div>
      </div>

      <div v-else class="upload-placeholder">
        <div class="icon-circle">
          <Upload class="upload-icon" />
        </div>

        <div class="upload-text">
          <p class="primary-text">Drag & Drop File Here</p>
          <p class="secondary-text">
            Drag and drop your PNG, JPG, WebP, SVG images here or browse (Max: 10MB)
          </p>
        </div>

        <span class="browse-link" @click="triggerFileInput">Browse File</span>
      </div>
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.upload-container {
  border: 1px dashed var(--color-text-secondary);
  border-radius: var(--radius-md);
  padding: 32px;
  background-color: var(--color-bg-primary);
  text-align: center;
  transition: all 0.2s ease;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

.upload-container.is-dragging {
  border-color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.upload-container.has-error {
  border-color: var(--color-danger);
}

.hidden-input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.upload-icon {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.primary-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.secondary-text {
  font-size: 12px;
  color: var(--color-text-secondary);
  max-width: 300px;
  line-height: 1.5;
}

.browse-link {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 8px;
}

.preview-mode {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.preview-overlay {
  position: absolute;
  top: -10px;
  right: -10px;
}

.preview-close-icon {
  width: 18px;
  height: 18px;
}

.error-message {
  font-size: 12px;
  color: var(--color-danger);
}
</style>
