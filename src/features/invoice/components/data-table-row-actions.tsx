'use client'

import { ORPCError } from '@orpc/client'
import { EllipsisVertical, Eye, FileText, Pencil, Trash2 } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/server/orpc/client'
import type { Invoice } from '../types'

export function DataTableRowActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await api.invoices.delete({ id: invoice.id })
      toast.success('فاکتور با موفقیت حذف شد.')
      setDeleteOpen(false)
      router.refresh()
    } catch (error) {
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این فاکتور یافت نشد.')
      } else {
        toast.error('حذف فاکتور ناموفق بود. دوباره تلاش کنید.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
            />
          }
        >
          <EllipsisVertical />
          <span className="sr-only">عملیات</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            nativeButton={false}
            render={<Link href={`/dashboard/invoices/${invoice.id}/edit`} />}
          >
            <Pencil />
            ویرایش
          </DropdownMenuItem>
          <DropdownMenuItem
            nativeButton={false}
            render={<Link href={`/dashboard/invoices/${invoice.id}`} />}
          >
            <Eye />
            پیش‌نمایش
          </DropdownMenuItem>
          <DropdownMenuItem
            nativeButton={false}
            render={<Link href={`/invoices/${invoice.id}/print`} />}
          >
            <FileText />
            خروجی PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف فاکتور</DialogTitle>
            <DialogDescription>
              آیا از حذف فاکتور شماره {invoice.number} مطمئن هستید؟ این عملیات
              قابل بازگشت نیست.
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
              onClick={handleDelete}
            >
              {isDeleting ? 'در حال حذف…' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
