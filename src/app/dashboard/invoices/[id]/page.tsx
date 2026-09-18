import { call, ORPCError } from '@orpc/server'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getInvoice } from '@/features/invoice/api/queries'
import { InvoicePreviewActions } from '@/features/invoice/components/invoice-preview-actions'
import { InvoicePrintDocument } from '@/features/invoice/components/invoice-print-document'
import { INVOICE_TYPE, type InvoiceDetail } from '@/features/invoice/types'
import { numberFormatter } from '@/features/invoice/utils/format'
import { getBusinessProfile } from '@/features/settings/api/queries'

export const instant = false

export const metadata = {
  title: 'پیش‌نمایش فاکتور',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let invoice: InvoiceDetail
  try {
    invoice = await call(getInvoice, { id })
  } catch (error) {
    if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
      notFound()
    }
    throw error
  }

  const profile = await call(getBusinessProfile)

  return (
    <div className="space-y-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link href="/dashboard/invoices" />}
            aria-label="بازگشت به لیست فاکتورها"
          >
            <ArrowRight />
          </Button>
          <h1 className="font-black text-xl">
            {INVOICE_TYPE[invoice.type].label} شماره{' '}
            <span className="tabular-nums">
              {numberFormatter.format(invoice.number)}
            </span>
          </h1>
        </div>
        <InvoicePreviewActions invoiceId={invoice.id} />
      </div>

      <section aria-label="پیش‌نمایش سند" className="print:bg-white print:p-0">
        <div className="mx-auto max-w-4xl">
          <InvoicePrintDocument invoice={invoice} profile={profile} />
        </div>
      </section>
    </div>
  )
}
