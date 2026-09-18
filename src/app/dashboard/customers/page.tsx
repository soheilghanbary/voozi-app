import { call } from '@orpc/server'
import { Suspense } from 'react'
import { DataTableSkeleton } from '@/components/data-table-skeleton'
import { PageHeader } from '@/components/page-header'
import { listCustomers } from '@/features/customer/api/queries'
import { columns } from '@/features/customer/components/columns'
import { DataTable } from '@/features/customer/components/data-table'

export default function Page() {
  return (
    <div className="space-y-4">
      <PageHeader title="مشتریان" />
      <Suspense fallback={<DataTableSkeleton rows={6} columns={6} />}>
        <CustomersTable />
      </Suspense>
    </div>
  )
}

async function CustomersTable() {
  const customers = await call(listCustomers)
  return <DataTable columns={columns} data={customers} />
}
