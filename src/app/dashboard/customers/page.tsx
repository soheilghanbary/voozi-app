import { call } from '@orpc/server'
import { listCustomers } from '@/features/customer/api/queries'
import { columns } from '@/features/customer/components/columns'
import { DataTable } from '@/features/customer/components/data-table'

export const instant = false

export default async function Page() {
  const customers = await call(listCustomers)

  return (
    <div className="space-y-4">
      <h1 className="font-black text-xl">مشتریان</h1>
      <DataTable columns={columns} data={customers} />
    </div>
  )
}
