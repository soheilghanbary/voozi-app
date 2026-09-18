import { call } from '@orpc/server'
import { PageHeader } from '@/components/page-header'
import { listCustomers } from '@/features/customer/api/queries'
import { columns } from '@/features/customer/components/columns'
import { DataTable } from '@/features/customer/components/data-table'

export const instant = false

export default async function Page() {
  const customers = await call(listCustomers)

  return (
    <div className="space-y-4">
      <PageHeader title="مشتریان" />
      <DataTable columns={columns} data={customers} />
    </div>
  )
}
