'use client'

import * as React from 'react'
import type { Product } from '../types'

export type ProductSort =
  | 'newest'
  | 'oldest'
  | 'name'
  | 'priceAsc'
  | 'priceDesc'

function filterProducts(products: Product[], query: string, sort: ProductSort) {
  const keyword = query.trim().toLowerCase()

  const matches = keyword
    ? products.filter((product) => product.name.toLowerCase().includes(keyword))
    : [...products]

  matches.sort((a, b) => {
    switch (sort) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'name':
        return a.name.localeCompare(b.name, 'fa')
      case 'priceAsc':
        return a.basePrice - b.basePrice
      case 'priceDesc':
        return b.basePrice - a.basePrice
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return matches
}

export function useProductList(products: Product[]) {
  const [query, setQuery] = React.useState('')
  const [sort, setSort] = React.useState<ProductSort>('newest')
  const [pageSize, setPageSize] = React.useState(12)
  const [pageIndex, setPageIndex] = React.useState(0)

  const filteredProducts = React.useMemo(
    () => filterProducts(products, query, sort),
    [products, query, sort]
  )

  const totalCount = filteredProducts.length
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePageIndex = Math.min(pageIndex, pageCount - 1)

  const pageStart = safePageIndex * pageSize
  const pageProducts = React.useMemo(
    () => filteredProducts.slice(pageStart, pageStart + pageSize),
    [filteredProducts, pageStart, pageSize]
  )

  function handleSearch(value: string) {
    setQuery(value)
    setPageIndex(0)
  }

  function handleSortChange(value: ProductSort) {
    setSort(value)
    setPageIndex(0)
  }

  function handlePageSizeChange(value: number) {
    setPageSize(value)
    setPageIndex(0)
  }

  return {
    products: pageProducts,
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
