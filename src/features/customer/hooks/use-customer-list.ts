'use client'

import * as React from 'react'
import type { Customer } from '../types'

export type CustomerSort = 'newest' | 'oldest' | 'name'

function filterCustomers(
  customers: Customer[],
  query: string,
  sort: CustomerSort
) {
  const keyword = query.trim().toLowerCase()

  const matches = keyword
    ? customers.filter((customer) =>
        [customer.name, customer.mobile, customer.phone].some((value) =>
          value.toLowerCase().includes(keyword)
        )
      )
    : [...customers]

  matches.sort((a, b) => {
    switch (sort) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'name':
        return a.name.localeCompare(b.name, 'fa')
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return matches
}

export function useCustomerList(customers: Customer[]) {
  const [query, setQuery] = React.useState('')
  const [sort, setSort] = React.useState<CustomerSort>('newest')
  const [pageSize, setPageSize] = React.useState(12)
  const [pageIndex, setPageIndex] = React.useState(0)

  const filteredCustomers = React.useMemo(
    () => filterCustomers(customers, query, sort),
    [customers, query, sort]
  )

  const totalCount = filteredCustomers.length
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePageIndex = Math.min(pageIndex, pageCount - 1)

  const pageStart = safePageIndex * pageSize
  const pageCustomers = React.useMemo(
    () => filteredCustomers.slice(pageStart, pageStart + pageSize),
    [filteredCustomers, pageStart, pageSize]
  )

  function handleSearch(value: string) {
    setQuery(value)
    setPageIndex(0)
  }

  function handleSortChange(value: CustomerSort) {
    setSort(value)
    setPageIndex(0)
  }

  function handlePageSizeChange(value: number) {
    setPageSize(value)
    setPageIndex(0)
  }

  return {
    customers: pageCustomers,
    totalCount,
    searchQuery: query,
    handleSearch,
    sort,
    handleSortChange,
    pageSize,
    handlePageSizeChange,
    pageIndex: safePageIndex,
    pageCount,
    hasNextPage: safePageIndex < pageCount - 1,
    hasPreviousPage: safePageIndex > 0,
    firstPage: () => setPageIndex(0),
    previousPage: () => setPageIndex((index) => Math.max(index - 1, 0)),
    nextPage: () => setPageIndex((index) => Math.min(index + 1, pageCount - 1)),
    lastPage: () => setPageIndex(pageCount - 1),
  }
}
