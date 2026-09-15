export const INVOICE_STATUS = {
  draft: { label: 'پیش‌نویس' },
  confirmed: { label: 'تأیید شده' },
  cancelled: { label: 'لغو شده' },
} as const

export type InvoiceStatus = keyof typeof INVOICE_STATUS

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
  customerId: string | null
  customerName: string | null
  status: InvoiceStatus
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
  status: 'وضعیت',
  createdAt: 'تاریخ ثبت',
}
