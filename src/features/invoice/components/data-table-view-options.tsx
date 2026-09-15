'use client'

import type { ReactTable, RowData } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { INVOICE_COLUMN_LABELS } from '../types'
import type { InvoiceTableFeatures } from '../utils/data-table-features'

export function DataTableViewOptions<TData extends RowData>({
  table,
}: {
  table: ReactTable<InvoiceTableFeatures, TData>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="ms-auto hidden h-7 lg:flex"
          />
        }
      >
        <Settings2 />
        نمایش ستون‌ها
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-45">
        <DropdownMenuGroup>
          <DropdownMenuLabel>ستون‌های قابل نمایش</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {INVOICE_COLUMN_LABELS[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
