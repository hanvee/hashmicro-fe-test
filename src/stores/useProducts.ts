import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IProduct, IProductRequest } from '@/types/models/productModels'
import { matchesSearch, matchesFilters, compareProducts } from '@/helpers'
import productData from '@/data/productData.json'

export const useProductsStore = defineStore('products', () => {
  // --- State ---
  const products = ref<IProduct[]>([])
  const searchQuery = ref<string>('')
  const currentPage = ref<number>(1)
  const itemsPerPage = ref<number>(5)
  const isLoading = ref<boolean>(false)
  const isCreating = ref<boolean>(false)
  const isUpdating = ref<boolean>(false)
  const isDeleting = ref<boolean>(false)

  const sortBy = ref<string>('id')
  const sortOrder = ref<'asc' | 'desc'>('desc')
  const activeFilters = ref<Record<string, string>>({})

  // --- Computed Properties ---
  const searchedProducts = computed(() => {
    if (!searchQuery.value) return products.value
    return products.value.filter((product) => matchesSearch(product, searchQuery.value))
  })

  const filteredProducts = computed(() => {
    if (Object.keys(activeFilters.value).length === 0) return searchedProducts.value
    return searchedProducts.value.filter((product) => matchesFilters(product, activeFilters.value))
  })

  const sortedProducts = computed(() => {
    if (!sortBy.value) return filteredProducts.value

    const field = sortBy.value as keyof IProduct
    const multiplier = sortOrder.value === 'asc' ? 1 : -1

    return [...filteredProducts.value].sort((a, b) => {
      return compareProducts(a, b, field) * multiplier
    })
  })

  const paginatedProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return sortedProducts.value.slice(startIndex, endIndex)
  })

  const totalItems = computed(() => sortedProducts.value.length)

  const totalPages = computed(() => {
    if (totalItems.value === 0) return 0
    return Math.ceil(totalItems.value / itemsPerPage.value)
  })

  // --- Actions ---
  const fetchProducts = async () => {
    isLoading.value = true
    try {
      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      products.value = productData as IProduct[]
    } finally {
      isLoading.value = false
    }
  }

  const addProduct = async (product: IProductRequest): Promise<void> => {
    isCreating.value = true
    try {
      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const newId = products.value.length > 0 ? Math.max(...products.value.map((p) => p.id)) + 1 : 1
      products.value.push({ ...product, id: newId })
    } finally {
      isCreating.value = false
    }
  }

  const updateProduct = async (product: IProduct): Promise<void> => {
    isUpdating.value = true
    try {
      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const index = products.value.findIndex((p) => p.id === product.id)
      if (index !== -1) {
        products.value[index] = product
      }
    } finally {
      isUpdating.value = false
    }
  }

  const deleteProduct = async (id: number): Promise<void> => {
    isDeleting.value = true
    try {
      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      products.value = products.value.filter((p) => p.id !== id)

      // Adjust page if current page is now empty
      if (paginatedProducts.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    } finally {
      isDeleting.value = false
    }
  }

  const setPage = (page: number) => {
    const maxPage = totalPages.value || 1
    if (page >= 1 && page <= maxPage) {
      currentPage.value = page
    }
  }

  const setSearch = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  const setSort = (field: string) => {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
  }

  const setFilter = (key: string, value: string) => {
    if (!value) {
      const { [key]: removed, ...remaining } = activeFilters.value
      activeFilters.value = remaining
    } else {
      activeFilters.value = { ...activeFilters.value, [key]: value }
    }
    currentPage.value = 1
  }

  const clearFilter = () => {
    activeFilters.value = {}
    currentPage.value = 1
  }

  return {
    products,
    searchQuery,
    currentPage,
    itemsPerPage,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    sortBy,
    sortOrder,
    activeFilters,
    searchedProducts,
    filteredProducts,
    sortedProducts,
    totalItems,
    totalPages,
    paginatedProducts,
    fetchProducts,
    setPage,
    setSearch,
    setSort,
    setFilter,
    clearFilter,
    addProduct,
    updateProduct,
    deleteProduct,
  }
})
