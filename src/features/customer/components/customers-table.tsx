'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { client } from '@/server/orpc/client'
import { columns } from './columns'
import { DataTable } from './data-table'

export function CustomersTable() {
  const { data: customers } = useSuspenseQuery(
    client.customers.list.queryOptions()
  )

  return <DataTable columns={columns} data={customers} />
}
