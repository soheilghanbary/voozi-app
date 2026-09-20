'use client'

import { type ReactElement, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Product } from '../types'
import { ProductForm } from './product-form'

type ProductFormDialogProps = {
  product?: Product
  trigger?: ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProductFormDialog({
  product,
  trigger,
  open,
  onOpenChange,
}: ProductFormDialogProps) {
  const [openState, setOpenState] = useState(false)
  const isControlled = open !== undefined

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setOpenState(next)
    onOpenChange?.(next)
  }

  return (
    <Dialog
      open={isControlled ? open : openState}
      onOpenChange={handleOpenChange}
    >
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-h-[calc(100dvh-4rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? 'ویرایش محصول' : 'محصول جدید'}</DialogTitle>
          <DialogDescription>
            {product
              ? `ویرایش «${product.name}» و ذخیره تغییرات.`
              : 'محصول یا خدمات جدید را ثبت کنید.'}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          key={product?.id ?? 'new'}
          product={product}
          onSaved={() => handleOpenChange(false)}
          onCancelled={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
