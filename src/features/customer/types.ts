export const CUSTOMER_TYPE = {
  individual: { label: 'حقیقی' },
  corporate: { label: 'حقوقی' },
} as const

export type CustomerType = keyof typeof CUSTOMER_TYPE

export type Customer = {
  id: string
  name: string
  customerType: CustomerType
  mobile: string
  phone: string
  address: string
  nationalId: string
  createdAt: string
}

export const CUSTOMER_COLUMN_LABELS: Record<string, string> = {
  name: 'نام',
  nationalId: 'شناسه ملی',
  customerType: 'حقیقی یا حقوقی',
  mobile: 'شماره تماس',
  phone: 'تلفن',
  address: 'آدرس',
  createdAt: 'تاریخ عضویت',
}
