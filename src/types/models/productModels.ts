import type { ProductStatus } from '../enums/productEnums'

export interface IProduct {
  id: number
  name: string
  sku: string
  category: string
  price: number
  status: ProductStatus
  image?: File | null
  imageUrl?: string
}

export type IProductRequest = Omit<IProduct, 'id'>