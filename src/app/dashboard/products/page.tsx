import { Suspense } from 'react'
import { DataTableSkeleton } from '@/components/data-table-skeleton'
import { PageHeader } from '@/components/page-header'
import { ProductsTable } from '@/features/product/components/products-table'

export default function Page() {
  return (
    <div className="space-y-4">
      <PageHeader title="محصولات" />
      <Suspense fallback={<DataTableSkeleton rows={6} columns={5} />}>
        <ProductsTable />
      </Suspense>
    </div>
  )
}
