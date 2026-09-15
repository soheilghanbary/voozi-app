import { call } from '@orpc/server'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { listCustomers } from '@/features/customer/api/queries'
import { InvoiceForm } from '@/features/invoice/components/invoice-form'
import { listProducts } from '@/features/product/api/queries'

export const instant = false

export default async function Page() {
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
        <h1 className="font-black text-xl">فاکتور جدید</h1>
      </div>
      <Card className="max-w-5xl">
        <CardHeader>
          <CardTitle>افزودن فاکتور</CardTitle>
          <CardDescription>
            مشتری و اقلام فاکتور را وارد کرده و ثبت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceForm customers={customers} products={products} />
        </CardContent>
      </Card>
    </div>
  )
}
