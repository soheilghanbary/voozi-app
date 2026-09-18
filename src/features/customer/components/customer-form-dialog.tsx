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
import type { Customer } from '../types'
import { CustomerForm } from './customer-form'

type CustomerFormDialogProps = {
  customer?: Customer
  trigger?: ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CustomerFormDialog({
  customer,
  trigger,
  open,
  onOpenChange,
}: CustomerFormDialogProps) {
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
      <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{customer ? 'ویرایش مشتری' : 'مشتری جدید'}</DialogTitle>
          <DialogDescription>
            {customer
              ? `ویرایش «${customer.name}» و ذخیره تغییرات.`
              : 'مشتری جدید را ثبت کنید.'}
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          key={customer?.id ?? 'new'}
          customer={customer}
          onSaved={() => handleOpenChange(false)}
          onCancelled={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
