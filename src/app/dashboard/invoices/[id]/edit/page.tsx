import { call, ORPCError } from '@orpc/server'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { listCustomers } from '@/features/customer/api/queries'
import { getInvoice } from '@/features/invoice/api/queries'
import { InvoiceForm } from '@/features/invoice/components/invoice-form'
import type { InvoiceDetail } from '@/features/invoice/types'
import { listProducts } from '@/features/product/api/queries'

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

  const [customers, products] = await Promise.all([
    call(listCustomers),
    call(listProducts),
  ])

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <PageHeader
        backHref="/dashboard/invoices"
        backLabel="بازگشت به لیست فاکتورها"
        title="ویرایش فاکتور"
      />
      <Card>
        <CardHeader>
          <CardTitle>ویرایش «فاکتور شماره {invoice.number}»</CardTitle>
          <CardDescription>
            اطلاعات فاکتور را ویرایش کرده و تغییرات را ثبت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            invoice={invoice}
            customers={customers}
            products={products}
          />
        </CardContent>
      </Card>
    </div>
  )
}
