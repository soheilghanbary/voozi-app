import { PageHeader } from '@/components/page-header'
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
      <PageHeader
        backHref="/dashboard/customers"
        backLabel="بازگشت به لیست مشتریان"
        title="مشتری جدید"
      />
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
