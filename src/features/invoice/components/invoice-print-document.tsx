// biome-ignore-all lint/performance/noImgElement: brand logo and signature are stored as data URLs in the database

import { FileText, Globe, Phone, Smartphone } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { appConfig } from '@/config'
import { CURRENCY } from '@/features/settings/types'
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

export function InvoicePrintDocument({
  invoice,
  profile,
}: {
  invoice: InvoiceDetail
  profile?: {
    name?: string | null
    title?: string | null
    description?: string | null
    logo?: string | null
    signature?: string | null
    phone?: string | null
    tel?: string | null
    website?: string | null
    currency?: 'rial' | 'toman' | null
  } | null
}) {
  const totals = computeTotals(invoice)
  const money = (value: number) => numberFormatter.format(value)
  const issueDate = dateFormatter.format(new Date(invoice.issueDate))
  const dueDate = invoice.dueDate
    ? dateFormatter.format(new Date(invoice.dueDate))
    : null

  const brandName = profile?.name?.trim() || appConfig.name
  const brandTitle = profile?.title?.trim()
  const currency = profile?.currency ?? 'toman'

  return (
    <div className="mx-auto max-w-full overflow-hidden rounded-2xl bg-white text-zinc-900 ring-1 ring-zinc-200 print:w-auto print:max-w-none print:rounded-none print:shadow-none print:ring-0">
      <div className="h-1.5 bg-linear-to-l from-primary via-primary/60 to-primary/10" />

      <div className="px-4 pt-8 pb-10 sm:px-10 print:px-4 print:pt-4 print:pb-4">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex items-center gap-3">
            {profile?.logo ? (
              <img
                src={profile.logo}
                alt={brandName}
                className="size-12 rounded-2xl object-contain sm:size-14"
              />
            ) : (
              <div className="grid size-12 place-items-center rounded-2xl border text-primary-foreground shadow-xs">
                <FileText className="size-6 text-blue-500" />
              </div>
            )}
            <div className="space-y-0.5">
              <p className="font-black text-lg text-zinc-900 leading-tight">
                {brandName}
              </p>
              <p className="text-xs text-zinc-500">
                {brandTitle ??
                  (invoice.type === 'invoice' ? 'فاکتور فروش' : 'پیش فاکتور')}
              </p>
              {(profile?.phone || profile?.tel || profile?.website) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                  {profile?.phone && (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 tabular-nums"
                      dir="ltr"
                    >
                      <Smartphone className="size-3" />
                      {profile.phone}
                    </span>
                  )}
                  {profile?.tel && (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 tabular-nums"
                      dir="ltr"
                    >
                      <Phone className="size-3" />
                      {profile.tel}
                    </span>
                  )}
                  {profile?.website && (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 tabular-nums"
                      dir="ltr"
                    >
                      <Globe className="size-3" />
                      {profile.website}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-end">
            <p className="text-center font-black text-2xl text-zinc-900 tracking-tight sm:text-end">
              {INVOICE_TYPE[invoice.type].label}
            </p>
            <div className="mt-1.5 inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 px-3 py-1 sm:justify-start">
              <span className="text-xs text-zinc-500">شماره سند</span>
              <span className="font-bold text-sm text-zinc-900 tabular-nums">
                {money(invoice.number)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3.5">
            <p className="mb-1 font-medium text-[11px] text-zinc-500 tracking-wide">
              مشتری
            </p>
            <p className="font-bold text-sm text-zinc-900">
              {invoice.customerName || '—'}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-100 p-3.5">
            <p className="mb-1 font-medium text-[11px] text-zinc-500 tracking-wide">
              تاریخ صدور
            </p>
            <p className="font-bold text-sm text-zinc-900">{issueDate}</p>
          </div>
          <div className="rounded-xl border border-zinc-100 p-3.5">
            <p className="mb-1 font-medium text-[11px] text-zinc-500 tracking-wide">
              سررسید
            </p>
            <p className="font-bold text-sm text-zinc-900">{dueDate ?? '—'}</p>
          </div>
          <div className="col-span-2 rounded-xl bg-primary/5 p-3.5 ring-1 ring-primary/10 sm:col-span-1">
            <p className="mb-1 font-medium text-[11px] text-zinc-500 tracking-wide">
              مبلغ نهایی
            </p>
            <p className="font-black text-base text-zinc-900 tabular-nums">
              {money(totals.grandTotal)}
            </p>
          </div>
        </div>

        <div className="mt-8 hidden overflow-hidden rounded-xl border border-zinc-200 md:block print:block">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-200 hover:bg-transparent">
                <TableHead className="bg-zinc-50 px-3 py-2.5 text-center font-semibold text-[11px] text-zinc-500 tracking-wide">
                  ردیف
                </TableHead>
                <TableHead className="bg-zinc-50 px-3 py-2.5 text-center font-semibold text-[11px] text-zinc-500 tracking-wide">
                  شرح
                </TableHead>
                <TableHead className="bg-zinc-50 px-3 py-2.5 text-center font-semibold text-[11px] text-zinc-500 tracking-wide">
                  واحد
                </TableHead>
                <TableHead className="bg-zinc-50 px-3 py-2.5 text-center font-semibold text-[11px] text-zinc-500 tracking-wide">
                  تعداد
                </TableHead>
                <TableHead className="bg-zinc-50 px-3 py-2.5 text-center font-semibold text-[11px] text-zinc-500 tracking-wide">
                  قیمت واحد
                </TableHead>
                <TableHead className="bg-zinc-50 px-3 py-2.5 text-center font-semibold text-[11px] text-zinc-500 tracking-wide">
                  تخفیف
                </TableHead>
                <TableHead className="bg-zinc-50 px-3 py-2.5 text-center font-semibold text-[11px] text-zinc-500 tracking-wide">
                  جمع
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="border-zinc-100 odd:bg-zinc-50/40 hover:bg-transparent"
                >
                  <TableCell className="px-3 py-3 text-center text-sm text-zinc-500 tabular-nums">
                    {money(index + 1)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-center font-medium text-sm text-zinc-900">
                    {item.name}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-center text-sm text-zinc-600">
                    {item.unit}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-center font-semibold text-sm text-zinc-900 tabular-nums">
                    {money(item.quantity)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-center font-semibold text-sm text-zinc-900 tabular-nums">
                    {money(item.unitPrice)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-center text-sm text-zinc-600 tabular-nums">
                    {money(item.discount)}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-center font-bold text-sm text-zinc-900 tabular-nums">
                    {money(
                      lineNet(item.quantity, item.unitPrice, item.discount)
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 space-y-3 md:hidden print:hidden">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-zinc-200">
              <div className="flex items-center justify-between gap-2 border-zinc-100 border-b px-4 py-3">
                <p className="font-bold text-sm text-zinc-900">{item.name}</p>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  ردیف {money(index + 1)}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">واحد</dt>
                  <dd className="font-medium text-zinc-800">{item.unit}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">تعداد</dt>
                  <dd className="font-semibold text-zinc-900 tabular-nums">
                    {money(item.quantity)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">قیمت واحد</dt>
                  <dd className="font-semibold text-zinc-900 tabular-nums">
                    {money(item.unitPrice)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">تخفیف</dt>
                  <dd className="text-zinc-700 tabular-nums">
                    {money(item.discount)}
                  </dd>
                </div>
              </dl>
              <div className="flex items-center justify-between gap-2 border-zinc-100 border-t border-dashed px-4 py-3">
                <span className="text-muted-foreground text-xs">جمع</span>
                <span className="font-bold text-zinc-900 tabular-nums">
                  {money(lineNet(item.quantity, item.unitPrice, item.discount))}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="order-2 sm:order-1">
            {invoice.note && (
              <div className="max-w-xs rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                <p className="mb-1 font-medium text-[11px] text-zinc-500 tracking-wide">
                  یادداشت
                </p>
                <p className="whitespace-pre-wrap text-sm text-zinc-700 leading-relaxed">
                  {invoice.note}
                </p>
              </div>
            )}
          </div>

          <div className="order-1 w-full max-w-xs sm:order-2">
            <div className="space-y-2.5 rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between text-sm text-zinc-600">
                <span>جمع ({CURRENCY[currency].label})</span>
                <span className="tabular-nums">{money(totals.subtotal)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex items-center justify-between text-sm text-zinc-600">
                  <span>تخفیف</span>
                  <span className="tabular-nums">
                    {money(invoice.discount)}
                  </span>
                </div>
              )}
              {invoice.taxRate > 0 && (
                <div className="flex items-center justify-between text-sm text-zinc-600">
                  <span>مالیات ({invoice.taxRate}٪)</span>
                  <span className="tabular-nums">{money(totals.tax)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-zinc-600">
                <span>مبلغ نهایی ({CURRENCY[currency].label})</span>
                <span className="font-black text-xl tabular-nums">
                  {money(totals.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!invoice.note && (
          <div className="mt-8 flex items-end justify-end gap-8">
            <div className="w-36 border-zinc-300 border-b border-dashed pb-8 text-center">
              {profile?.signature ? (
                <img
                  src={profile.signature}
                  alt="امضا"
                  className="mx-auto mb-1 max-h-16 w-auto object-contain"
                />
              ) : null}
              <span className="text-[11px] text-zinc-400">
                امضا و مهر فروشنده
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-1 text-center">
          {profile?.description && (
            <p className="max-w-md text-[11px] text-zinc-400 leading-relaxed">
              {profile.description}
            </p>
          )}
        </div>
      </div>

      <div className="border-zinc-100 border-t bg-zinc-50/60 px-10 py-4 text-center print:px-4">
        <p className="text-[11px] text-zinc-400">
          سند صادره توسط {brandName} — به صورت الکترونیکی صادر شده است
        </p>
      </div>
    </div>
  )
}
