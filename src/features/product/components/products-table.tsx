'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { client } from '@/server/orpc/client'
import { columns } from './columns'
import { DataTable } from './data-table'

export function ProductsTable() {
  const { data: products } = useSuspenseQuery(
    client.products.list.queryOptions()
  )

  return <DataTable columns={columns} data={products} />
}
