import { call } from '@orpc/server'
import { listProducts } from '@/features/product/api/queries'
import { columns } from '@/features/product/components/columns'
import { DataTable } from '@/features/product/components/data-table'

export const instant = false

export default async function Page() {
  const products = await call(listProducts)

  return (
    <div className="space-y-4">
      <h1 className="font-black text-xl">محصولات</h1>
      <DataTable columns={columns} data={products} />
    </div>
  )
}
