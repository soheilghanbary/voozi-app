import { call, ORPCError } from '@orpc/server'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
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
    <div className="space-y-6 py-6">
      <PageHeader
        backHref="/dashboard/invoices"
        backLabel="بازگشت به لیست فاکتورها"
        title={
          <>
            {INVOICE_TYPE[invoice.type].label} شماره{' '}
            <span className="tabular-nums">
              {numberFormatter.format(invoice.number)}
            </span>
          </>
        }
        className="print:hidden"
      >
        <InvoicePreviewActions invoiceId={invoice.id} />
      </PageHeader>

      <section aria-label="پیش‌نمایش سند" className="print:p-0">
        <div className="mx-auto max-w-5xl px-1 print:max-w-none print:px-0">
          <InvoicePrintDocument invoice={invoice} profile={profile} />
        </div>
      </section>
    </div>
  )
}
