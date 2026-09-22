import { Suspense } from 'react'
import { DataTableSkeleton } from '@/components/data-table-skeleton'
import { PageHeader } from '@/components/page-header'
import { InvoicesTable } from '@/features/invoice/components/invoices-table'

export default function Page() {
  return (
    <div className="space-y-4">
      <PageHeader title="فاکتورها" />
      <Suspense fallback={<DataTableSkeleton rows={7} />}>
        <InvoicesTable />
      </Suspense>
    </div>
  )
}
