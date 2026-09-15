import { call, ORPCError } from '@orpc/server'
import { notFound } from 'next/navigation'
import { getInvoice } from '@/features/invoice/api/queries'
import { InvoicePrintDocument } from '@/features/invoice/components/invoice-print-document'
import { PrintToolbar } from '@/features/invoice/components/print-toolbar'
import type { InvoiceDetail } from '@/features/invoice/types'

export const instant = false

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

  return (
    <div className="min-h-dvh bg-zinc-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-4xl px-4 print:max-w-none print:p-0">
        <div className="mb-4 print:hidden">
          <PrintToolbar />
        </div>
        <InvoicePrintDocument invoice={invoice} />
      </div>
    </div>
  )
}
