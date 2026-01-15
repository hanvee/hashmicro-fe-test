export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  OFFICE_EQUIPMENT = 'Office Equipment',
  FURNITURE = 'Furniture',
  ACCESSORIES = 'Accessories',
  NETWORKING = 'Networking',
  SERVER_STORAGE = 'Server & Storage',
  POWER_EQUIPMENT = 'Power Equipment',
  OFFICE_SUPPLIES = 'Office Supplies',
  STORAGE = 'Storage',
  SECURITY = 'Security',
}

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Office Equipment',
  'Furniture',
  'Accessories',
  'Networking',
  'Server & Storage',
  'Power Equipment',
  'Office Supplies',
  'Storage',
  'Security',
] as const
