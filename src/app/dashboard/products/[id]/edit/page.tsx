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
import { getProduct } from '@/features/product/api/queries'
import { ProductForm } from '@/features/product/components/product-form'
import type { Product } from '@/features/product/types'

export const instant = false

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let product: Product
  try {
    product = await call(getProduct, { id })
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
          render={<Link href="/dashboard/products" />}
          aria-label="بازگشت به لیست محصولات"
        >
          <ArrowRight />
        </Button>
        <h1 className="font-black text-xl">ویرایش محصول</h1>
      </div>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>ویرایش «{product.name}»</CardTitle>
          <CardDescription>
            اطلاعات محصول را ویرایش کرده و تغییرات را ثبت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} />
        </CardContent>
      </Card>
    </div>
  )
}
