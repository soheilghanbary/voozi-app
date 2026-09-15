'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
  useTable,
} from '@tanstack/react-table'
import * as React from 'react'
import {
  features,
  type InvoiceTableFeatures,
} from '../utils/data-table-features'

export function useInvoiceTable<TData extends RowData>({
  columns,
  data,
}: {
  columns: ColumnDef<InvoiceTableFeatures, TData>[]
  data: TData[]
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const searchValue =
    (table.getColumn('number')?.getFilterValue() as string) ?? ''

  function handleSearch(value: string) {
    table.setColumnFilters(value ? [{ id: 'number', value }] : [])
  }

  return {
    table,
    searchValue,
    handleSearch,
  }
}
