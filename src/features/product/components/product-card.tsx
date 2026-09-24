'use client'

import { ORPCError } from '@orpc/client'
import { useQueryClient } from '@tanstack/react-query'
import {
  BadgeCheck,
  BadgeX,
  CalendarDays,
  EllipsisVertical,
  Pencil,
  Scale,
  Tag,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { cn } from '@/lib/utils'
import { api, client } from '@/server/orpc/client'
import { PRODUCT_TYPE, PRODUCT_UNITS, type Product } from '../types'
import { dateFormatter, numberFormatter } from '../utils/format'
import { ProductFormDialog } from './product-form-dialog'

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
}

export function ProductCard({ product }: { product: Product }) {
  const queryClient = useQueryClient()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await api.products.delete({ id: product.id })
      toast.success('محصول با موفقیت حذف شد.')
      setDeleteOpen(false)
      queryClient.invalidateQueries({ queryKey: client.products.list.key() })
    } catch (error) {
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این محصول یافت نشد.')
      } else {
        toast.error('حذف محصول ناموفق بود. دوباره تلاش کنید.')
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
            <Avatar size="lg" className="shrink-0 bg-muted">
              <AvatarFallback>{getInitials(product.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-base leading-6">
                {product.name}
              </h3>
              <Badge
                variant={
                  product.productType === 'product' ? 'secondary' : 'outline'
                }
                className="mt-0.5"
              >
                {PRODUCT_TYPE[product.productType].label}
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
              <span className="sr-only">عملیات محصول</span>
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
        <div className="mt-2 space-y-0.5">
          <div className="flex items-center gap-2.5 px-1.5 py-1.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <Scale className="size-3.5" />
            </span>
            <span className="min-w-0 truncate text-sm">
              واحد: {PRODUCT_UNITS[product.unit].label}
            </span>
          </div>
          <div className="flex items-center gap-2.5 px-1.5 py-1.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <Tag className="size-3.5" />
            </span>
            <span className="min-w-0 truncate text-sm">
              قیمت پایه:{' '}
              <span className="font-medium tabular-nums">
                {numberFormatter.format(product.basePrice)}
              </span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <div
          className={cn(
            'ml-auto flex items-center gap-2.5 px-1.5 py-1.5 text-sm',
            !product.isActive && 'text-muted-foreground'
          )}
        >
          <span
            className={cn(
              'grid size-7 shrink-0 place-items-center rounded-md',
              product.isActive
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {product.isActive ? (
              <BadgeCheck className="size-3.5" />
            ) : (
              <BadgeX className="size-3.5" />
            )}
          </span>
          <span className="font-medium">
            {product.isActive ? 'فعال' : 'غیرفعال'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <CalendarDays className="size-3.5" />
          <span>
            ثبت در {dateFormatter.format(new Date(product.createdAt))}
          </span>
        </div>
      </CardFooter>

      <ProductFormDialog
        product={product}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف محصول</DialogTitle>
            <DialogDescription>
              آیا از حذف «{product.name}» مطمئن هستید؟ این عملیات قابل بازگشت
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
