import { cacheTag } from 'next/cache'
import { Suspense } from 'react'
import { DataTableSkeleton } from '@/components/data-table-skeleton'
import { PageHeader } from '@/components/page-header'
import { getCustomersByUserId } from '@/features/customer/api/queries'
import { columns } from '@/features/customer/components/columns'
import { DataTable } from '@/features/customer/components/data-table'
import { getSession } from '@/server/lib/session'

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
  const session = await getSession()
  const userId = session?.session.userId ?? ''

  return <CachedCustomersTable userId={userId} />
}

async function CachedCustomersTable({ userId }: { userId: string }) {
  'use cache'

  cacheTag(`customers:${userId}`)

  const customers = await getCustomersByUserId(userId)

  return <DataTable columns={columns} data={customers} />
}
