'use client'

import type { ColumnDef, RowData } from '@tanstack/react-table'
import { SearchIcon, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/server/orpc/client'
import { useInvoiceTable } from '../hooks/use-invoice-table'
import type { InvoiceTableFeatures } from '../utils/data-table-features'
import { DataTablePagination } from './data-table-pagination'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<InvoiceTableFeatures, TData>[]
  data: TData[]
}

export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const router = useRouter()
  const { table, searchValue, handleSearch } = useInvoiceTable({
    columns,
    data,
  })

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const selectedIds = selectedRows.map((row) => {
    const invoice = row.original as { id: string }
    return invoice.id
  })

  async function handleDeleteSelected() {
    setIsDeleting(true)
    try {
      await api.invoices.deleteMany({ ids: selectedIds })
      toast.success('فاکتورهای انتخاب‌شده حذف شدند.')
      setDeleteOpen(false)
      table.resetRowSelection()
      router.refresh()
    } catch (_error) {
      toast.error('حذف فاکتورها ناموفق بود. دوباره تلاش کنید.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full min-w-0 max-w-sm">
          <SearchIcon className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجوی شماره یا نام مشتری..."
            value={searchValue}
            onChange={(event) => handleSearch(event.target.value)}
            className="ps-8"
          />
        </div>
        <div className="ms-auto flex items-center gap-2">
          <Button
            size="sm"
            className="h-7"
            nativeButton={false}
            render={<Link href="/dashboard/invoices/new" />}
          >
            فاکتور جدید
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
          <span className="text-muted-foreground text-sm">
            {selectedCount} فاکتور انتخاب شده است.
          </span>
          <Button
            size="sm"
            variant="destructive"
            className="ms-auto h-7"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 />
            حذف انتخاب‌شده‌ها
          </Button>
        </div>
      )}
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
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
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف فاکتورها</DialogTitle>
            <DialogDescription>
              آیا از حذف {selectedCount} فاکتور انتخاب‌شده مطمئن هستید؟ این
              عملیات قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteSelected}
            >
              {isDeleting ? 'در حال حذف…' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
