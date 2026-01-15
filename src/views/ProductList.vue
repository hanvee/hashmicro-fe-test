<script setup lang="ts">
import { ProductTable } from '@/components/products'
import { useProductsStore } from '@/stores/useProducts'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui'
import { Plus } from '@/components/icons'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.vue'

const productStore = useProductsStore()
const router = useRouter()

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
})

const isDeleteModalOpen = ref(false)
const productToDelete = ref<number | null>(null)

const handleDelete = (id: number) => {
  productToDelete.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (productToDelete.value !== null) {
    await productStore.deleteProduct(productToDelete.value)
    isDeleteModalOpen.value = false
    productToDelete.value = null
  }
}

const cancelDelete = () => {
  isDeleteModalOpen.value = false
  productToDelete.value = null
}

const goToCreate = () => {
  router.push('/products/create')
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Product Management</h1>
      <Button class="btn-create" variant="accent" @click="goToCreate">
        <Plus class="btn-create-icon" />
        Create Product
      </Button>
    </div>

    <ProductTable @delete="handleDelete" />

    <ConfirmationDialog
      :isOpen="isDeleteModalOpen"
      :isLoading="productStore.isDeleting"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  color: var(--color-primary);
  font-weight: 700;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-create-icon {
  width: 18px;
  height: 18px;
}
</style>
