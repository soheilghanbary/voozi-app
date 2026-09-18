import { call } from '@orpc/server'
import { PageHeader } from '@/components/page-header'
import { listInvoices } from '@/features/invoice/api/queries'
import { columns } from '@/features/invoice/components/columns'
import { DataTable } from '@/features/invoice/components/data-table'

export const instant = false

export default async function Page() {
  const invoices = await call(listInvoices)

  return (
    <div className="space-y-4">
      <PageHeader title="فاکتورها" />
      <DataTable columns={columns} data={invoices} />
    </div>
  )
}
