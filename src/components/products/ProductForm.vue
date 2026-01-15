<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { IProduct, IProductRequest } from '@/types/models/productModels'
import { ProductStatus, PRODUCT_CATEGORIES } from '@/types/enums'
import { Button, FormInputText, FormSelect, FormImageUpload } from '@/components/ui'
import Alert from '@/components/ui/Alert.vue'

const props = defineProps<{
  initialData?: IProduct
  isEdit?: boolean
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: IProductRequest): void
  (e: 'cancel'): void
}>()

const formData = ref<IProductRequest>({
  name: '',
  sku: '',
  price: 0,
  category: '',
  status: ProductStatus.ACTIVE,
  image: null,
})

const categoryOptions = computed(() =>
  PRODUCT_CATEGORIES.map((category) => ({
    label: category,
    value: category,
  })),
)

const statusOptions = computed(() => [
  { label: 'Active', value: ProductStatus.ACTIVE },
  { label: 'Inactive', value: ProductStatus.INACTIVE },
])

onMounted(() => {
  if (props.initialData) {
    formData.value = { ...props.initialData }
  }
})

const handleSkuInput = (value: string | number) => {
  const stringValue = typeof value === 'number' ? value.toString() : value
  formData.value.sku = stringValue.toUpperCase()
}

const handlePriceInput = (value: string | number) => {
  const stringValue = typeof value === 'number' ? value.toString() : value
  const numberValue = stringValue.replace(/\D/g, '')
  formData.value.price = parseInt(numberValue) || 0
}

const displayPrice = computed(() => {
  if (!formData.value.price) return ''
  return new Intl.NumberFormat('id-ID').format(formData.value.price)
})

const errorMessage = ref<string>('')

const hasError = computed(() => !!errorMessage.value)

const handleSubmit = () => {
  errorMessage.value = ''

  // Simple validation
  if (
    !formData.value.name ||
    !formData.value.sku ||
    !formData.value.category ||
    !formData.value.price
  ) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }
  emit('submit', formData.value)
}
const clearError = () => {
  errorMessage.value = ''
}
</script>

<template>
  <div class="form-card">
    <Alert
      v-if="errorMessage"
      variant="error"
      title="Validation Error"
      :message="errorMessage"
      :closeable="true"
      @close="clearError"
      class="form-error"
    />
    <form @submit.prevent="handleSubmit" class="product-form">
      <div class="form-grid">
        <div class="form-left">
          <FormInputText
            label="Product Name"
            v-model="formData.name"
            placeholder="Enter product name"
            required
          />

          <FormInputText
            label="SKU Code"
            :model-value="formData.sku"
            @update:model-value="handleSkuInput"
            placeholder="e.g. HM-ERP-001"
            required
          />

          <FormInputText
            label="Price (IDR)"
            :model-value="displayPrice"
            @update:model-value="handlePriceInput"
            placeholder="Rp 0"
            required
          />

          <FormSelect
            label="Category"
            v-model="formData.category"
            :options="categoryOptions"
            placeholder="Select category"
            required
          />

          <FormSelect label="Status" v-model="formData.status" :options="statusOptions" required />
        </div>
        <div class="form-right">
          <FormImageUpload
            v-model="formData.image"
            :preview-url="formData.imageUrl"
            label="Product Image"
          />
        </div>
      </div>

      <div class="form-actions">
        <Button variant="outline" :disabled="isLoading" @click.prevent="emit('cancel')">
          Cancel
        </Button>
        <Button variant="accent" type="submit" :isLoading="isLoading" :disabled="isLoading">
          {{ isEdit ? 'Save Changes' : 'Create Product' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-card {
  background: var(--color-white);
  padding: 32px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  max-width: 1200px;
  margin: 0 auto;
}

.form-error {
  margin-bottom: 16px;
}

.form-title {
  margin-bottom: 24px;
  color: var(--color-primary);
  font-size: 24px;
  font-weight: 600;
  border-bottom: 2px solid var(--color-bg-secondary);
  padding-bottom: 12px;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, 1fr);
}

.form-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
