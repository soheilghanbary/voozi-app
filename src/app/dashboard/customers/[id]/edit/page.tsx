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
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/dashboard/customers" />}
          aria-label="بازگشت به لیست مشتریان"
        >
          <ArrowRight />
        </Button>
        <h1 className="font-black text-xl">ویرایش مشتری</h1>
      </div>
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
