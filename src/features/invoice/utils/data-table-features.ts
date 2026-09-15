import {
  columnFilteringFeature,
  columnVisibilityFeature,
  constructFilterFn,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table'
import type { Invoice } from '../types'

const filterFn_invoiceSearch = constructFilterFn({
  filter: (_dataValue, filterValue, row) => {
    const value = String(filterValue ?? '')
      .trim()
      .toLowerCase()
    const invoice = row.original as Invoice
    return (
      String(invoice.number).includes(value) ||
      (invoice.customerName ?? '').toLowerCase().includes(value)
    )
  },
  autoRemove: (filterValue) => !String(filterValue ?? '').trim(),
})

export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { invoiceSearch: filterFn_invoiceSearch },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

export type InvoiceTableFeatures = typeof features
