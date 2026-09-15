import { FileText } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { appConfig } from '@/config'
import { INVOICE_TYPE, type InvoiceDetail } from '../types'
import { dateFormatter, numberFormatter } from '../utils/format'

function lineNet(quantity: number, unitPrice: number, discount: number) {
  return Math.max(0, quantity * unitPrice - discount)
}

function computeTotals(invoice: InvoiceDetail): {
  subtotal: number
  afterDiscount: number
  tax: number
  grandTotal: number
} {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + lineNet(item.quantity, item.unitPrice, item.discount),
    0
  )
  const afterDiscount = Math.max(0, subtotal - invoice.discount)
  const tax = Math.round((afterDiscount * invoice.taxRate) / 100)
  const grandTotal = afterDiscount + tax
  return { subtotal, afterDiscount, tax, grandTotal }
}

export function InvoicePrintDocument({ invoice }: { invoice: InvoiceDetail }) {
  const totals = computeTotals(invoice)
  const money = (value: number) => numberFormatter.format(value)
  const issueDate = dateFormatter.format(new Date(invoice.issueDate))
  const dueDate = invoice.dueDate
    ? dateFormatter.format(new Date(invoice.dueDate))
    : null

  return (
    <div className="mx-auto w-[794px] max-w-full rounded-2xl bg-white text-zinc-900 shadow-xl shadow-zinc-200/60 ring-1 ring-zinc-200 print:w-auto print:max-w-none print:rounded-none print:bg-white print:shadow-none print:ring-0">
      <div className="flex items-start justify-between gap-6 p-8 print:p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <FileText className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-black text-base text-zinc-900">
              {appConfig.name}
            </p>
            <p className="text-xs text-zinc-500">سند فروش</p>
          </div>
        </div>
        <div className="space-y-1 text-end">
          <p className="font-black text-xl text-zinc-900">
            {INVOICE_TYPE[invoice.type].label}
          </p>
          <p className="font-semibold text-sm text-zinc-700">
            شماره {money(invoice.number)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-8 pb-8 sm:grid-cols-4 print:px-4 print:pb-4">
        <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
          <p className="mb-1 font-medium text-xs text-zinc-500">مشتری</p>
          <p className="font-semibold text-sm text-zinc-900">
            {invoice.customerName || '—'}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
          <p className="mb-1 font-medium text-xs text-zinc-500">تاریخ صدور</p>
          <p className="font-semibold text-sm text-zinc-900">{issueDate}</p>
        </div>
        {dueDate ? (
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
            <p className="mb-1 font-medium text-xs text-zinc-500">سررسید</p>
            <p className="font-semibold text-sm text-zinc-900">{dueDate}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 border-dashed p-3">
            <p className="mb-1 font-medium text-xs text-zinc-400">سررسید</p>
            <p className="text-sm text-zinc-400">—</p>
          </div>
        )}
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
          <p className="mb-1 font-medium text-primary text-xs">مبلغ نهایی</p>
          <p className="font-black text-sm text-zinc-900 tabular-nums">
            {money(totals.grandTotal)}
          </p>
        </div>
      </div>

      <div className="px-8 pb-8 print:px-4 print:pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200 hover:bg-transparent">
              <TableHead className="bg-zinc-50 text-center font-medium text-xs text-zinc-500">
                ردیف
              </TableHead>
              <TableHead className="bg-zinc-50 text-center font-medium text-xs text-zinc-500">
                شرح
              </TableHead>
              <TableHead className="bg-zinc-50 text-center font-medium text-xs text-zinc-500">
                واحد
              </TableHead>
              <TableHead className="bg-zinc-50 text-center font-medium text-xs text-zinc-500">
                تعداد
              </TableHead>
              <TableHead className="bg-zinc-50 text-center font-medium text-xs text-zinc-500">
                قیمت واحد
              </TableHead>
              <TableHead className="bg-zinc-50 text-center font-medium text-xs text-zinc-500">
                تخفیف
              </TableHead>
              <TableHead className="bg-zinc-50 text-center font-medium text-xs text-zinc-500">
                جمع
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item, index) => (
              <TableRow
                key={item.id}
                className="border-zinc-100 hover:bg-transparent"
              >
                <TableCell className="text-center text-sm text-zinc-500">
                  {index + 1}
                </TableCell>
                <TableCell className="text-center font-medium text-sm text-zinc-900">
                  {item.name}
                </TableCell>
                <TableCell className="text-center text-sm text-zinc-600">
                  {item.unit}
                </TableCell>
                <TableCell className="text-center text-sm text-zinc-900 tabular-nums">
                  {money(item.quantity)}
                </TableCell>
                <TableCell className="text-center text-sm text-zinc-900 tabular-nums">
                  {money(item.unitPrice)}
                </TableCell>
                <TableCell className="text-center text-sm text-zinc-600 tabular-nums">
                  {money(item.discount)}
                </TableCell>
                <TableCell className="text-center font-bold text-sm text-zinc-900 tabular-nums">
                  {money(lineNet(item.quantity, item.unitPrice, item.discount))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {invoice.note && (
          <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
            <p className="mb-1 font-medium text-xs text-zinc-500">یادداشت</p>
            <p className="whitespace-pre-wrap text-sm text-zinc-700">
              {invoice.note}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs rounded-xl border border-zinc-100 bg-zinc-50 p-4">
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>جمع</span>
              <span className="tabular-nums">{money(totals.subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="mt-2 flex items-center justify-between text-sm text-zinc-600">
                <span>تخفیف</span>
                <span className="tabular-nums">{money(invoice.discount)}</span>
              </div>
            )}
            {invoice.taxRate > 0 && (
              <div className="mt-2 flex items-center justify-between text-sm text-zinc-600">
                <span>مالیات ({invoice.taxRate}٪)</span>
                <span className="tabular-nums">{money(totals.tax)}</span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between border-zinc-200 border-t pt-3">
              <span className="font-black text-sm text-zinc-900">
                مبلغ نهایی
              </span>
              <span className="font-black text-lg text-primary tabular-nums">
                {money(totals.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
