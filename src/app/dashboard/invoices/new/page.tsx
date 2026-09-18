import { call } from '@orpc/server'
import { PageHeader } from '@/components/page-header'
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
      <PageHeader
        backHref="/dashboard/invoices"
        backLabel="بازگشت به لیست فاکتورها"
        title="فاکتور جدید"
      />
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
