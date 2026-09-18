import { call } from '@orpc/server'
import { Suspense } from 'react'
import { DataTableSkeleton } from '@/components/data-table-skeleton'
import { PageHeader } from '@/components/page-header'
import { listInvoices } from '@/features/invoice/api/queries'
import { columns } from '@/features/invoice/components/columns'
import { DataTable } from '@/features/invoice/components/data-table'

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

async function InvoicesTable() {
  const invoices = await call(listInvoices)
  return <DataTable columns={columns} data={invoices} />
}
