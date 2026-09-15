export const PRODUCT_TYPE = {
  product: { label: 'محصول' },
  service: { label: 'خدمات' },
} as const

export type ProductType = keyof typeof PRODUCT_TYPE

export const PRODUCT_UNITS = {
  item: { label: 'عدد' },
  kilogram: { label: 'کیلوگرم' },
  gram: { label: 'گرم' },
  meter: { label: 'متر' },
  squareMeter: { label: 'متر مربع' },
  liter: { label: 'لیتر' },
  hour: { label: 'ساعت' },
  day: { label: 'روز' },
  session: { label: 'جلسه' },
  package: { label: 'بسته' },
  box: { label: 'کارتن' },
} as const

export type ProductUnit = keyof typeof PRODUCT_UNITS

export type Product = {
  id: string
  name: string
  productType: ProductType
  unit: ProductUnit
  basePrice: number
  description: string
  isActive: boolean
  createdAt: string
}

export const PRODUCT_COLUMN_LABELS: Record<string, string> = {
  name: 'نام',
  productType: 'خدمات یا محصول',
  unit: 'واحد اندازه‌گیری',
  basePrice: 'قیمت پایه',
  description: 'توضیحات',
  isActive: 'وضعیت',
  createdAt: 'تاریخ ثبت',
}
