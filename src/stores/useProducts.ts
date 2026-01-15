import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IProduct, IProductRequest } from '@/types/models/productModels'
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

  const filteredProducts = computed(() => {
    let result = [...products.value]

    // Search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query),
      )
    }

    // Filters
    result = result.filter((p) =>
      Object.entries(activeFilters.value).every(
        ([key, value]) => !value || p[key as keyof IProduct] === value,
      ),
    )

    // Sorting
    if (sortBy.value) {
      const key = sortBy.value as keyof IProduct
      const order = sortOrder.value === 'asc' ? 1 : -1

      result.sort((a, b) => {
        const valA = a[key]
        const valB = b[key]

        if (valA == null && valB == null) return 0
        if (valA == null) return 1
        if (valB == null) return -1

        if (valA < valB) return -order
        if (valA > valB) return order
        return 0
      })
    }

    return result
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
  })

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredProducts.value.slice(start, end)
  })

  const totalItems = computed(() => filteredProducts.value.length)

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
      if (paginatedProducts.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    } finally {
      isDeleting.value = false
    }
  }

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
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

  const setFilter = (key: string, value: any) => {
    if (!value) {
      const newFilters = { ...activeFilters.value }
      delete newFilters[key]
      activeFilters.value = newFilters
    } else {
      activeFilters.value = { ...activeFilters.value, [key]: value }
    }
    currentPage.value = 1
  }

  const clearFilter = () => {
    activeFilters.value = {}
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
    filteredProducts,
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
