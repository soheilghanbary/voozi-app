'use client'

import type { ColumnDef, RowData } from '@tanstack/react-table'
import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProductTable } from '../hooks/use-product-table'
import type { ProductTableFeatures } from '../utils/data-table-features'
import { DataTablePagination } from './data-table-pagination'
import { DataTableViewOptions } from './data-table-view-options'
import { ProductFormDialog } from './product-form-dialog'

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<ProductTableFeatures, TData>[]
  data: TData[]
}

export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const { table, searchValue, handleSearch } = useProductTable({
    columns,
    data,
  })

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full min-w-0 max-w-sm">
          <SearchIcon className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجوی نام یا توضیحات..."
            value={searchValue}
            onChange={(event) => handleSearch(event.target.value)}
            className="ps-8"
          />
        </div>
        <div className="ms-auto flex items-center gap-2">
          <ProductFormDialog trigger={<Button>محصول جدید</Button>} />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  نتیجه‌ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
