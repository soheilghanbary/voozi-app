import { Suspense } from 'react'
import { PageHeader } from '@/components/page-header'
import { ProductsList } from '@/features/product/components/products-list'
import { ProductsListSkeleton } from '@/features/product/components/products-list-skeleton'

export default function Page() {
  return (
    <div className="space-y-4">
      <PageHeader title="محصولات" />
      <Suspense fallback={<ProductsListSkeleton />}>
        <ProductsList />
      </Suspense>
    </div>
  )
}
