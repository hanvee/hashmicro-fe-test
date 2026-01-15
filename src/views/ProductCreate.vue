<script setup lang="ts">
import { ProductForm } from '@/components/products'
import { useProductsStore } from '@/stores/useProducts'
import { useRouter } from 'vue-router'
import type { IProductRequest } from '@/types/models/productModels'

const router = useRouter()
const productStore = useProductsStore()

const handleSubmit = async (data: IProductRequest): Promise<void> => {
  try {
    await productStore.addProduct(data)
    router.push('/products')
  } catch (error) {
    console.error('Error saving product:', error)
  }
}

const handleCancel = (): void => {
  router.push('/products')
}
</script>

<template>
  <div>
    <h1 class="page-title">Create Product</h1>
    <ProductForm
      :is-edit="false"
      :is-loading="productStore.isCreating"
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
