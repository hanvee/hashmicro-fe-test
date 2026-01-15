<script setup lang="ts">
import { useProductsStore } from '@/stores/useProducts'
import { useRouter } from 'vue-router'
import { Button, Badge } from '@/components/ui'
import BaseTable from '@/components/ui/BaseTable.vue'
import type { TableHeader, TableFilter } from '@/components/ui/BaseTable.vue'
import { formatCurrency } from '@/utils/textFormatters'
import { ProductStatus, PRODUCT_CATEGORIES } from '@/types/enums'
import { Pen, Trash } from '../icons'
import EmptyImage from '../icons/EmptyImage.vue'

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

const productStore = useProductsStore()
const router = useRouter()

const headers: TableHeader[] = [
  { text: 'Image', value: 'image', align: 'center', width: '80px' },
  { text: 'Name', value: 'name', sortable: true },
  { text: 'SKU', value: 'sku', sortable: true },
  { text: 'Category', value: 'category', sortable: true },
  { text: 'Status', value: 'status', sortable: true },
  { text: 'Price', value: 'price', align: 'right', sortable: true },
  { text: 'Actions', value: 'actions', align: 'left', width: '120px' },
]

const filters: TableFilter[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: Object.values(ProductStatus).map((status) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: status,
    })),
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: PRODUCT_CATEGORIES.map((category) => ({
      label: category,
      value: category,
    })),
  },
]

const editProduct = (id: number) => {
  router.push(`/products/${id}/edit`)
}

const getStatusColor = (status: string) => {
  return status === ProductStatus.ACTIVE ? 'success' : 'error'
}
</script>

<template>
  <div class="product-table-wrapper">
    <BaseTable
      :headers="headers"
      :items="productStore.paginatedProducts"
      :loading="productStore.isLoading"
      :total-items="productStore.totalItems"
      :items-per-page="productStore.itemsPerPage"
      :current-page="productStore.currentPage"
      :search-query="productStore.searchQuery"
      :sort-by="productStore.sortBy"
      :sort-order="productStore.sortOrder"
      :filters="filters"
      :active-filters="productStore.activeFilters"
      @update:searchQuery="productStore.setSearch"
      @update:itemsPerPage="productStore.itemsPerPage = $event"
      @update:currentPage="productStore.setPage"
      @update:sort="productStore.setSort"
      @update:filter="productStore.setFilter"
      @clear-filters="productStore.clearFilter"
    >
      <!-- Image Slot -->
      <template #item.image="{ item }">
        <img v-if="item.imageUrl" :src="item.imageUrl" alt="Product Image" class="product-image" />
        <div v-else class="empty-image">
          <EmptyImage class="empty-image-icon" />
        </div>
      </template>

      <!-- Name Slot -->
      <template #item.name="{ item }">
        <span class="font-medium">{{ item.name }}</span>
      </template>

      <!-- Status Slot -->
      <template #item.status="{ item }">
        <Badge :color="getStatusColor(item.status)" variant="light" size="sm">
          {{ item.status }}
        </Badge>
      </template>

      <!-- Price Slot -->
      <template #item.price="{ item }">
        {{ formatCurrency(item.price) }}
      </template>

      <!-- Actions Slot -->
      <template #item.actions="{ item }">
        <div class="actions-wrapper">
          <Button variant="ghost-accent" size="sm" @click="editProduct(item.id)" title="Edit">
            <Pen class="actions-icon" />
            Edit
          </Button>
          <Button variant="ghost-danger" size="sm" @click="emit('delete', item.id)" title="Delete">
            <Trash class="actions-icon" />
            Delete
          </Button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped>
.product-image {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.empty-image {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

.empty-image-icon {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.font-medium {
  font-weight: 500;
  color: var(--color-primary);
}

.actions-wrapper {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}

.actions-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}
</style>
