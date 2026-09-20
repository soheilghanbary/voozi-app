'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import {
  PRODUCT_TYPE,
  PRODUCT_UNITS,
  type Product,
  type ProductType,
  type ProductUnit,
} from '../types'
import type { ProductTableFeatures } from '../utils/data-table-features'
import { dateFormatter, numberFormatter } from '../utils/format'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

const columnHelper = createColumnHelper<ProductTableFeatures, Product>()

export const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نام" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue<string>('name')}</div>
    ),
    filterFn: 'productSearch',
  }),
  columnHelper.accessor('productType', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="خدمات یا محصول" />
    ),
    cell: ({ row }) => {
      const productType = row.getValue<ProductType>('productType')
      return (
        <Badge variant={productType === 'product' ? 'secondary' : 'outline'}>
          {PRODUCT_TYPE[productType].label}
        </Badge>
      )
    },
  }),
  columnHelper.accessor('unit', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="واحد اندازه‌گیری" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {PRODUCT_UNITS[row.getValue<ProductUnit>('unit')].label}
      </div>
    ),
  }),
  columnHelper.accessor('basePrice', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="قیمت پایه" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap tabular-nums">
        {numberFormatter.format(row.getValue<number>('basePrice'))}
      </div>
    ),
  }),
  columnHelper.accessor('isActive', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="وضعیت" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>('isActive')
      return (
        <Badge variant={isActive ? 'secondary' : 'outline'}>
          {isActive ? 'فعال' : 'غیرفعال'}
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
      <DataTableRowActions product={row.original as Product} />
    ),
    enableHiding: false,
  }),
])
