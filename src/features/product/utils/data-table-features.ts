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
import type { Product } from '../types'

const filterFn_productSearch = constructFilterFn({
  filter: (_dataValue, filterValue, row) => {
    const value = String(filterValue ?? '')
      .trim()
      .toLowerCase()
    const product = row.original as Product
    return product.name.toLowerCase().includes(value)
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
  filterFns: { productSearch: filterFn_productSearch },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

export type ProductTableFeatures = typeof features
