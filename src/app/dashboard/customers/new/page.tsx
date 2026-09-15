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
import { CustomerForm } from '@/features/customer/components/customer-form'

export default function NewCustomerPage() {
  return (
    <div className="mx-auto mt-12 w-full max-w-xl space-y-4">
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
        <h1 className="font-black text-xl">مشتری جدید</h1>
      </div>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>افزودن مشتری</CardTitle>
          <CardDescription>
            اطلاعات مشتری را وارد کرده و ثبت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm />
        </CardContent>
      </Card>
    </div>
  )
}
