'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { client } from '@/server/orpc/client'
import { columns } from './columns'
import { DataTable } from './data-table'

export function InvoicesTable() {
  const { data: invoices } = useSuspenseQuery(
    client.invoices.list.queryOptions()
  )

  return <DataTable columns={columns} data={invoices} />
}
