'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { INVOICE_TYPE, type Invoice, type InvoiceType } from '../types'
import type { InvoiceTableFeatures } from '../utils/data-table-features'
import { dateFormatter, numberFormatter } from '../utils/format'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

const columnHelper = createColumnHelper<InvoiceTableFeatures, Invoice>()

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="انتخاب همه"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="انتخاب ردیف"
      />
    ),
    enableHiding: false,
  }),
  columnHelper.accessor('number', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="شماره" />
    ),
    cell: ({ row }) => (
      <div className="font-medium tabular-nums">
        {numberFormatter.format(row.getValue<number>('number'))}
      </div>
    ),
    filterFn: 'invoiceSearch',
  }),
  columnHelper.accessor('customerName', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="مشتری" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue<string>('customerName') || '—'}
      </div>
    ),
  }),
  columnHelper.accessor('issueDate', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاریخ صدور" />
    ),
    cell: ({ row }) => {
      const issueDate = row.getValue<string>('issueDate')
      return (
        <div className="whitespace-nowrap text-muted-foreground">
          {dateFormatter.format(new Date(issueDate))}
        </div>
      )
    },
  }),
  columnHelper.accessor('total', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="جمع کل" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap font-medium tabular-nums">
        {numberFormatter.format(row.getValue<number>('total'))}
      </div>
    ),
  }),
  columnHelper.accessor('type', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نوع" />
    ),
    cell: ({ row }) => {
      const type = row.getValue<InvoiceType>('type')
      return (
        <Badge variant={type === 'invoice' ? 'secondary' : 'outline'}>
          {INVOICE_TYPE[type].label}
        </Badge>
      )
    },
  }),
  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاریخ ثبت" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue<string>('createdAt')
      return (
        <div className="whitespace-nowrap text-muted-foreground">
          {dateFormatter.format(new Date(createdAt))}
        </div>
      )
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: () => null,
    cell: ({ row }) => (
      <DataTableRowActions invoice={row.original as Invoice} />
    ),
    enableHiding: false,
  }),
])
