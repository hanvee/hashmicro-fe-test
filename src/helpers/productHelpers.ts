import type { IProduct } from '@/types/models'

export const matchesSearch = (product: IProduct, query: string): boolean => {
  const searchLower = query.toLowerCase()
  return (
    product.name.toLowerCase().includes(searchLower) ||
    product.sku.toLowerCase().includes(searchLower)
  )
}

export const matchesFilters = (product: IProduct, filters: Record<string, string>): boolean => {
  return Object.entries(filters).every(([key, value]) => {
    if (!value) return true
    return product[key as keyof IProduct] === value
  })
}

export const compareProducts = (a: IProduct, b: IProduct, field: keyof IProduct): number => {
  const valueA = a[field]
  const valueB = b[field]

  // Handle null/undefined
  if (valueA == null && valueB == null) return 0
  if (valueA == null) return 1
  if (valueB == null) return -1

  // Compare values
  if (valueA < valueB) return -1
  if (valueA > valueB) return 1
  return 0
}
