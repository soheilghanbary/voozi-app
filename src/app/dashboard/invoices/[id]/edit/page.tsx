import { call, ORPCError } from '@orpc/server'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
    <div className="space-y-4">
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
        <h1 className="font-black text-xl">ویرایش فاکتور</h1>
      </div>
      <Card className="max-w-5xl">
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
