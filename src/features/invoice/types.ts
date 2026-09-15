export const INVOICE_TYPE = {
  proforma: { label: 'پیش فاکتور' },
  invoice: { label: 'فاکتور فروش' },
} as const

export type InvoiceType = keyof typeof INVOICE_TYPE

export type InvoiceItem = {
  id: string
  productId: string | null
  name: string
  unit: string
  quantity: number
  unitPrice: number
  discount: number
}

export type Invoice = {
  id: string
  number: number
  type: InvoiceType
  customerId: string | null
  customerName: string | null
  issueDate: string
  dueDate: string | null
  discount: number
  taxRate: number
  note: string
  total: number
  createdAt: string
}

export type InvoiceDetail = Invoice & { items: InvoiceItem[] }

export const INVOICE_COLUMN_LABELS: Record<string, string> = {
  number: 'شماره',
  customerName: 'مشتری',
  issueDate: 'تاریخ صدور',
  total: 'جمع کل',
  type: 'نوع',
  createdAt: 'تاریخ ثبت',
}
