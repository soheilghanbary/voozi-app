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
  createdAt: string
}
