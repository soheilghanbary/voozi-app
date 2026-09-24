import type { KeyboardEvent } from 'react'
import type { InvoiceDetail } from '../../types'
import { numberFormatter } from '../../utils/format'
import type { InvoiceFormValues } from '../../utils/invoice-schema'

export const emptyItem: InvoiceFormValues['items'][number] = {
  productId: null,
  name: '',
  unit: '',
  quantity: 1,
  unitPrice: 0,
  discount: 0,
}

export const emptyForm: InvoiceFormValues = {
  type: 'proforma',
  customerId: '',
  discount: 0,
  taxRate: 0,
  note: '',
  signature: false,
  items: [emptyItem],
}

export function toFormValues(invoice: InvoiceDetail): InvoiceFormValues {
  return {
    type: invoice.type,
    customerId: invoice.customerId ?? '',
    discount: invoice.discount,
    taxRate: invoice.taxRate,
    note: invoice.note,
    signature: invoice.signature,
    items: invoice.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
    })),
  }
}

export function computeTotals(
  items: InvoiceFormValues['items'],
  discount: number,
  taxRate: number
) {
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Math.max(
        0,
        (item.quantity || 0) * (item.unitPrice || 0) - (item.discount || 0)
      ),
    0
  )
  const afterDiscount = Math.max(0, subtotal - discount)
  const tax = Math.round((afterDiscount * taxRate) / 100)
  return { subtotal, afterDiscount, tax, total: afterDiscount + tax }
}

export const money = (value: number) => numberFormatter.format(value)

export const ITEM_GRID =
  'lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1.05fr)_minmax(4.75rem,0.75fr)_minmax(6rem,1fr)_minmax(6rem,1fr)_minmax(5.5rem,0.9fr)_2rem]'

export const SHEET_ORDER = [
  'product',
  'name',
  'qty',
  'price',
  'discount',
] as const
export type SheetField = (typeof SHEET_ORDER)[number]

export const itemCellId = (index: number, field: SheetField) =>
  `invoice-item-${index}-${field}`

export function focusSheetCell(index: number, field: SheetField) {
  requestAnimationFrame(() => {
    const element = document.getElementById(itemCellId(index, field))
    if (!element) return
    element.focus({ preventScroll: true })
    element.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })
}

export function advanceSheetCell(index: number, field: SheetField) {
  const pos = SHEET_ORDER.indexOf(field)
  if (pos === -1 || pos === SHEET_ORDER.length - 1) {
    focusSheetCell(index + 1, 'product')
    return
  }
  focusSheetCell(index, SHEET_ORDER[pos + 1])
}

export function handleSheetEnter(
  event: KeyboardEvent<HTMLInputElement>,
  index: number,
  field: SheetField
) {
  if (event.key !== 'Enter') return
  event.preventDefault()
  const pos = SHEET_ORDER.indexOf(field)
  if (event.shiftKey) {
    if (pos <= 0) return
    focusSheetCell(index, SHEET_ORDER[pos - 1])
    return
  }
  advanceSheetCell(index, field)
}
