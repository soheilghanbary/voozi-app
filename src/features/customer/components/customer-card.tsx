'use client'

import { ORPCError } from '@orpc/client'
import { useQueryClient } from '@tanstack/react-query'
import {
  CalendarDays,
  EllipsisVertical,
  MapPin,
  Pencil,
  Smartphone,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Buildings2, User2 } from 'reicon-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
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
import { api, client } from '@/server/orpc/client'
import { CUSTOMER_TYPE, type Customer } from '../types'
import { dateFormatter } from '../utils/format'
import { CustomerFormDialog } from './customer-form-dialog'

function _getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
}

export function CustomerCard({ customer }: { customer: Customer }) {
  const queryClient = useQueryClient()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const typeMeta = CUSTOMER_TYPE[customer.customerType]

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await api.customers.delete({ id: customer.id })
      toast.success('مشتری با موفقیت حذف شد.')
      setDeleteOpen(false)
      queryClient.invalidateQueries({ queryKey: client.customers.list.key() })
    } catch (error) {
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این مشتری یافت نشد.')
      } else {
        toast.error('حذف مشتری ناموفق بود. دوباره تلاش کنید.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card
      size="sm"
      className="h-full transition-shadow duration-200 hover:shadow-md"
    >
      <CardContent className="flex-1 gap-0">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid place-items-center rounded-full bg-muted p-2">
              {customer.customerType === 'corporate' ? (
                <Buildings2 className="size-6" />
              ) : (
                <User2 className="size-6" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-base leading-6">
                {customer.name}
              </h3>
              <Badge
                variant={
                  customer.customerType === 'individual'
                    ? 'secondary'
                    : 'outline'
                }
                className="mt-0.5"
              >
                {typeMeta.label}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="-me-1 -mt-1 text-muted-foreground"
                />
              }
            >
              <EllipsisVertical />
              <span className="sr-only">عملیات مشتری</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil />
                ویرایش
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
        </header>

        <div className="mt-4 space-y-1">
          <a
            href={`tel:${customer.mobile}`}
            className="group/mobile flex items-center gap-2.5 rounded-md px-1.5 py-1.5 transition-colors hover:bg-muted"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground transition-colors group-hover/mobile:bg-primary/10 group-hover/mobile:text-primary">
              <Smartphone className="size-3.5" />
            </span>
            <span
              dir="ltr"
              className="min-w-0 truncate text-start text-sm tabular-nums"
            >
              {customer.mobile}
            </span>
          </a>
          {customer.address && (
            <div className="flex items-center gap-2.5 px-1.5 py-1.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <MapPin className="size-3.5" />
              </span>
              <span className="min-w-0 truncate text-muted-foreground text-sm">
                {customer.address}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <CalendarDays className="size-3.5" />
          <span>
            عضویت در {dateFormatter.format(new Date(customer.createdAt))}
          </span>
        </div>
      </CardFooter>

      <CustomerFormDialog
        customer={customer}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف مشتری</DialogTitle>
            <DialogDescription>
              آیا از حذف «{customer.name}» مطمئن هستید؟ این عملیات قابل بازگشت
              نیست.
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
    </Card>
  )
}
