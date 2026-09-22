'use client'

import { useState } from 'react'
import { InvoicePrintDocument } from '@/features/invoice/components/invoice-print-document'
import type { InvoiceDetail } from '@/features/invoice/types'
import {
  INVOICE_COLOR_LABELS,
  INVOICE_COLOR_STYLES,
  INVOICE_COLORS,
  type InvoiceColor,
} from '@/features/settings/utils/invoice-colors'
import { cn } from '@/lib/utils'

const sampleInvoice: InvoiceDetail = {
  id: 'sample',
  number: 132,
  type: 'invoice',
  customerId: null,
  customerName: 'فروشگاه آنلاین سپهر',
  issueDate: '2026-09-21T09:30:00.000Z',
  dueDate: '2026-09-28T09:30:00.000Z',
  discount: 500000,
  taxRate: 9,
  note: 'لطفاً مبلغ نهایی را به حساب اعلام‌شده واریز کنید.',
  signature: false,
  total: 32482000,
  createdAt: '2026-09-21T09:30:00.000Z',
  items: [
    {
      id: 'item-1',
      productId: null,
      name: 'هدفون بی‌سیم مدل Aero',
      unit: 'عدد',
      quantity: 12,
      unitPrice: 2400000,
      discount: 0,
    },
    {
      id: 'item-2',
      productId: null,
      name: 'خدمت تنظیم و راه‌اندازی',
      unit: 'سرویس',
      quantity: 1,
      unitPrice: 1500000,
      discount: 0,
    },
  ],
}

export function PreviewDemo() {
  const [color, setColor] = useState<InvoiceColor>('indigo')

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center justify-between gap-3 border-border/70 border-b bg-muted/40 px-4 py-2.5">
          <span className="flex items-center gap-2 text-muted-foreground text-xs">
            <span className="size-1.5 rounded-full bg-primary" />
            پیش‌نمایش زنده فاکتور
          </span>
          <div
            role="group"
            aria-label="رنگ فاکتور"
            className="flex items-center gap-1.5"
          >
            {INVOICE_COLORS.slice(0, 5).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={color === c}
                aria-label={INVOICE_COLOR_LABELS[c]}
                className={cn(
                  'size-5 cursor-pointer rounded-full transition-transform',
                  INVOICE_COLOR_STYLES[c].swatch,
                  color === c &&
                    'ring-2 ring-ring ring-offset-2 ring-offset-card'
                )}
              />
            ))}
          </div>
        </div>
        <div className="bg-zinc-50/60 p-3 sm:p-5">
          <InvoicePrintDocument
            invoice={sampleInvoice}
            profile={{
              name: 'وزیا',
              title: 'سامانه صدور فاکتور',
              description:
                'فاکتور الکترونیکی با برند شما؛ صدور سریع و چاپ تمیز',
              currency: 'toman',
              invoiceColor: color,
            }}
          />
        </div>
      </div>
    </div>
  )
}
