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
import { getCustomer } from '@/features/customer/api/queries'
import { CustomerForm } from '@/features/customer/components/customer-form'
import type { Customer } from '@/features/customer/types'

export const instant = false

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let customer: Customer
  try {
    customer = await call(getCustomer, { id })
  } catch (error) {
    if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
      notFound()
    }
    throw error
  }

  return (
    <div className="space-y-4">
      <PageHeader
        backHref="/dashboard/customers"
        backLabel="بازگشت به لیست مشتریان"
        title="ویرایش مشتری"
      />
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>ویرایش «{customer.name}»</CardTitle>
          <CardDescription>
            اطلاعات مشتری را ویرایش کرده و تغییرات را ثبت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm customer={customer} />
        </CardContent>
      </Card>
    </div>
  )
}
