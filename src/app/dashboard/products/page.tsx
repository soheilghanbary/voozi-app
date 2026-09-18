import { call } from '@orpc/server'
import { PageHeader } from '@/components/page-header'
import { listProducts } from '@/features/product/api/queries'
import { columns } from '@/features/product/components/columns'
import { DataTable } from '@/features/product/components/data-table'

export const instant = false

export default async function Page() {
  const products = await call(listProducts)

  return (
    <div className="space-y-4">
      <PageHeader title="محصولات" />
      <DataTable columns={columns} data={products} />
    </div>
  )
}
