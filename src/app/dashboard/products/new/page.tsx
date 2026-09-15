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
import { ProductForm } from '@/features/product/components/product-form'

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/dashboard/products" />}
          aria-label="بازگشت به لیست محصولات"
        >
          <ArrowRight />
        </Button>
        <h1 className="font-black text-xl">محصول جدید</h1>
      </div>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>افزودن محصول</CardTitle>
          <CardDescription>
            اطلاعات محصول را وارد کرده و ثبت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  )
}
