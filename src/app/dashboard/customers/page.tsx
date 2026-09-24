import { Suspense } from 'react'
import { PageHeader } from '@/components/page-header'
import { CustomersList } from '@/features/customer/components/customers-list'
import { CustomersListSkeleton } from '@/features/customer/components/customers-list-skeleton'

export default function Page() {
  return (
    <div className="space-y-4">
      <PageHeader title="مشتریان" />
      <Suspense fallback={<CustomersListSkeleton />}>
        <CustomersList />
      </Suspense>
    </div>
  )
}
