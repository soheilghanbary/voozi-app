import { Suspense } from 'react'
import { DataTableSkeleton } from '@/components/data-table-skeleton'
import { PageHeader } from '@/components/page-header'
import { CustomersTable } from '@/features/customer/components/customers-table'

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
