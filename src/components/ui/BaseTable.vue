<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, ArrowDown } from '../icons'
import LoadingState from './LoadingState.vue'
import FormInputText from './FormInputText.vue'
import FormSelect from './FormSelect.vue'
import type { SelectOption } from './FormSelect.vue'
import Button from './Button.vue'

export interface TableHeader {
  text: string
  value: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

export interface TableFilter {
  key: string
  label: string
  type: 'select' | 'text'
  options?: SelectOption[]
  placeholder?: string
}

const props = withDefaults(
  defineProps<{
    headers: TableHeader[]
    items: any[]
    loading?: boolean
    totalItems?: number
    itemsPerPage?: number
    currentPage?: number
    searchQuery?: string
    noDataText?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    filters?: TableFilter[]
    activeFilters?: Record<string, any>
  }>(),
  {
    loading: false,
    totalItems: 0,
    itemsPerPage: 10,
    currentPage: 1,
    searchQuery: '',
    noDataText: 'No records found',
    sortBy: '',
    sortOrder: 'asc',
    filters: () => [],
    activeFilters: () => ({}),
  },
)

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:itemsPerPage', value: number): void
  (e: 'update:currentPage', value: number): void
  (e: 'update:sort', field: string): void
  (e: 'update:filter', key: string, value: any): void
  (e: 'clear-filters'): void
}>()

const itemsPerPageOptions = [5, 10, 20, 50, 100]

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return end > props.totalItems ? props.totalItems : end
})

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const handleSearch = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:searchQuery', target.value)
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}

const handleItemsPerPageChange = (value: string | number) => {
  const newVal = typeof value === 'string' ? parseInt(value) : value
  emit('update:itemsPerPage', newVal)
  emit('update:currentPage', 1)
}

const handleSort = (field: string) => {
  emit('update:sort', field)
}

const handleFilterChange = (key: string, value: string | number) => {
  emit('update:filter', key, value)
}

const hasActiveFilters = computed(() => {
  return Object.values(props.activeFilters).some((value) => value)
})

const handleClearFilters = () => {
  emit('clear-filters')
}
</script>

<template>
  <div class="base-table-wrapper">
    <!-- Top Bar: Search and Filters -->
    <div class="table-toolbar">
      <div class="filters-container">
        <!-- Global Search -->
        <FormInputText
          class="search-input"
          placeholder="Search..."
          :model-value="searchQuery"
          @input="handleSearch"
        />

        <!-- Filters -->
        <div class="filters-list">
          <div v-for="filter in filters" :key="filter.key" class="filter-item">
            <FormSelect
              v-if="filter.type === 'select'"
              :model-value="activeFilters[filter.key] || ''"
              :options="filter.options || []"
              :placeholder="filter.placeholder || `All ${filter.label}`"
              @update:model-value="handleFilterChange(filter.key, $event)"
            />
          </div>
          <Button
            v-if="hasActiveFilters"
            class="clear-filters-btn"
            @click="handleClearFilters"
            variant="outline"
            size="sm"
            type="button"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="table-container">
      <table class="base-table">
        <thead class="sticky-header">
          <tr>
            <th
              v-for="header in headers"
              :key="header.value"
              :style="{ width: header.width, textAlign: header.align || 'left' }"
              :class="{ clickable: header.sortable }"
              @click="header.sortable && handleSort(header.value)"
            >
              <div
                class="th-content"
                :class="{
                  'justify-end': header.align === 'right',
                  'justify-center': header.align === 'center',
                }"
              >
                <span>{{ header.text }}</span>
                <span
                  v-if="header.sortable"
                  class="sort-icon"
                  :class="{ visible: sortBy === header.value }"
                >
                  <ArrowDown
                    class="icon-arrow"
                    :class="{ 'rotate-180': sortBy === header.value && sortOrder === 'asc' }"
                  />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr>
            <td :colspan="headers.length" class="text-center py-4">
              <LoadingState />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="items.length === 0">
          <tr>
            <td :colspan="headers.length" class="text-center py-4">
              {{ noDataText }}
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(item, index) in items" :key="index">
            <td
              v-for="header in headers"
              :key="header.value"
              :style="{ textAlign: header.align || 'left' }"
            >
              <slot :name="`item.${header.value}`" :item="item" :index="index">
                {{ item[header.value] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div class="table-footer">
      <div class="pagination-controls">
        <span class="rows-per-page-label">Rows per page:</span>
        <FormSelect
          class="rows-per-page-select"
          :model-value="itemsPerPage"
          :options="itemsPerPageOptions.map((opt) => ({ label: String(opt), value: opt }))"
          :searchable="false"
          @update:model-value="handleItemsPerPageChange"
        />

        <span class="range-text"> {{ startItem }}-{{ endItem }} of {{ totalItems }} </span>

        <div class="nav-buttons">
          <button
            class="nav-btn"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            <ChevronLeft />
          </button>
          <button
            class="nav-btn"
            :disabled="currentPage >= totalPages"
            @click="handlePageChange(currentPage + 1)"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-table-wrapper {
  background: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  width: 100%;
}

.table-toolbar {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border-light);
}

.filters-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.filters-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  width: 300px;
}

.filter-item {
  min-width: 200px;
}

.table-container {
  overflow-x: auto;
  max-height: 70vh;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.sticky-header th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--color-bg-tertiary);
}

.base-table th {
  color: var(--color-text-primary);
  padding: 12px 24px;
  font-weight: 500;
  white-space: nowrap;
  user-select: none;
}

.base-table th.clickable {
  cursor: pointer;
}

.base-table th.clickable:hover {
  background-color: #f0f0f0;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.justify-end {
  justify-content: flex-end;
}

.justify-center {
  justify-content: center;
}

.sort-icon {
  display: inline-flex;
  opacity: 0;
  transition: opacity 0.2s;
  width: 16px;
  height: 16px;
}

.sort-icon.visible,
.base-table th.clickable:hover .sort-icon {
  opacity: 1;
}

.base-table td {
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text-primary);
}

.base-table tr:hover td {
  background-color: var(--color-bg-secondary);
}

.table-footer {
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-white);
  font-size: 12px;
  color: var(--color-text-secondary);
  flex-wrap: wrap;
  gap: 12px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.rows-per-page-label {
  white-space: nowrap;
}

.rows-per-page-select {
  width: 80px;
  position: relative;
  z-index: 101;
}

.rows-per-page-select :deep(.form-select) {
  height: 32px;
  padding: 6px 10px;
  font-size: 12px;
  min-width: 60px;
}

.rows-per-page-select :deep(.dropdown-menu) {
  bottom: 100%;
  top: auto;
  margin-bottom: 4px;
}

.rows-per-page-select :deep(.select-arrow) {
  width: 12px;
  height: 12px;
}

.range-text {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .table-footer {
    justify-content: flex-start;
  }

  .pagination-controls {
    gap: 12px;
  }

  .rows-per-page-label {
    font-size: 11px;
  }

  .rows-per-page-select {
    width: 70px;
  }

  .rows-per-page-select :deep(.form-select) {
    height: 28px;
    font-size: 11px;
    padding: 4px 8px;
  }

  .range-text {
    font-size: 11px;
  }

  .filter-item {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.nav-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.nav-btn:hover:not(:disabled) {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.text-center {
  text-align: center;
}

.py-4 {
  padding-top: 16px;
  padding-bottom: 16px;
}

.icon-arrow {
  width: 8px;
  height: 8px;
  transition: transform 0.2s;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
