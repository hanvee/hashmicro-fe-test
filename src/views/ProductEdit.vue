<script setup lang="ts">
import { ProductForm } from '@/components/products'
import { useProductsStore } from '@/stores/useProducts'
import { useToast } from '@/composables/useToast'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { IProductRequest } from '@/types/models/productModels'

const route = useRoute()
const router = useRouter()
const productStore = useProductsStore()
const toast = useToast()

const productId = computed(() => Number(route.params.id))

const initialData = computed(() => {
  if (productId.value) {
    return productStore.products.find((p) => p.id === productId.value)
  }
  return undefined
})

const handleSubmit = async (data: IProductRequest): Promise<void> => {
  try {
    await productStore.updateProduct({ ...data, id: productId.value })
    toast.success('Product updated successfully')
    router.push('/products')
  } catch (error) {
    console.error('Error saving product:', error)
    toast.error('Failed to update product')
  }
}

const handleCancel = (): void => {
  router.push('/products')
}
</script>

<template>
  <div>
    <h1 class="page-title">Edit Product</h1>
    <ProductForm
      :initial-data="initialData"
      :is-edit="true"
      :is-loading="productStore.isUpdating"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.page-title {
  font-size: 28px;
  color: var(--color-primary);
  font-weight: 700;
  margin-bottom: 24px;
}
</style>
