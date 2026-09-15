'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { CUSTOMER_TYPE, type Customer, type CustomerType } from '../types'
import type { CustomerTableFeatures } from '../utils/data-table-features'
import { dateFormatter } from '../utils/format'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

const columnHelper = createColumnHelper<CustomerTableFeatures, Customer>()

export const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام مشتری" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue<string>('name')}</div>
    ),
    filterFn: 'customerSearch',
  }),
  columnHelper.accessor('customerType', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="حقیقی یا حقوقی" />
    ),
    cell: ({ row }) => {
      const customerType = row.getValue<CustomerType>('customerType')
      const meta = CUSTOMER_TYPE[customerType]
      return (
        <Badge
          variant={customerType === 'individual' ? 'secondary' : 'outline'}
        >
          {meta.label}
        </Badge>
      )
    },
  }),
  columnHelper.accessor('mobile', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="شماره تماس" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap tabular-nums" dir="ltr">
        {row.getValue<string>('mobile')}
      </div>
    ),
  }),
  columnHelper.accessor('phone', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تلفن" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap tabular-nums" dir="ltr">
        {row.getValue<string>('phone')}
      </div>
    ),
  }),
  columnHelper.accessor('address', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="آدرس" />
    ),
    cell: ({ row }) => (
      <div className="max-w-56 truncate text-muted-foreground">
        {row.getValue<string>('address')}
      </div>
    ),
  }),
  columnHelper.accessor('nationalId', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="شناسه ملی یا کد ملی" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap tabular-nums" dir="ltr">
        {row.getValue<string>('nationalId')}
      </div>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تاریخ عضویت" />
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
      <DataTableRowActions customer={row.original as Customer} />
    ),
    enableHiding: false,
  }),
])
