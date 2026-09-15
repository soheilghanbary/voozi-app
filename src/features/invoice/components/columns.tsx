'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { INVOICE_STATUS, type Invoice, type InvoiceStatus } from '../types'
import type { InvoiceTableFeatures } from '../utils/data-table-features'
import { dateFormatter, numberFormatter } from '../utils/format'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

const columnHelper = createColumnHelper<InvoiceTableFeatures, Invoice>()

const statusVariant: Record<
  InvoiceStatus,
  'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
> = {
  draft: 'outline',
  confirmed: 'secondary',
  cancelled: 'destructive',
}

export const columns = columnHelper.columns([
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
  columnHelper.accessor('status', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="وضعیت" />
    ),
    cell: ({ row }) => {
      const status = row.getValue<InvoiceStatus>('status')
      return (
        <Badge variant={statusVariant[status]}>
          {INVOICE_STATUS[status].label}
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
