import {
  columnFilteringFeature,
  columnVisibilityFeature,
  constructFilterFn,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table'
import type { Customer } from '../types'

const filterFn_customerSearch = constructFilterFn({
  filter: (_dataValue, filterValue, row) => {
    const value = String(filterValue ?? '')
      .trim()
      .toLowerCase()
    const customer = row.original as Customer
    return customer.name.toLowerCase().includes(value)
  },
  autoRemove: (filterValue) => !String(filterValue ?? '').trim(),
})

export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { customerSearch: filterFn_customerSearch },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

export type CustomerTableFeatures = typeof features
