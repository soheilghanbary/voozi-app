import { call } from '@orpc/server'
import { Suspense } from 'react'
import { DataTableSkeleton } from '@/components/data-table-skeleton'
import { PageHeader } from '@/components/page-header'
import { listProducts } from '@/features/product/api/queries'
import { columns } from '@/features/product/components/columns'
import { DataTable } from '@/features/product/components/data-table'

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

async function ProductsTable() {
  const products = await call(listProducts)
  return <DataTable columns={columns} data={products} />
}
