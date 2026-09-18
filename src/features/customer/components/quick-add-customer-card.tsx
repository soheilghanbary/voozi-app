'use client'

import { Users } from 'lucide-react'
import { CustomerFormDialog } from './customer-form-dialog'

export function QuickAddCustomerCard() {
  return (
    <CustomerFormDialog
      trigger={
        <button
          type="button"
          className="group w-full cursor-pointer rounded-xl border bg-card p-4 text-start outline-none transition-colors hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <Users className="size-4.5" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-sm">افزودن مشتری</span>
              <span className="block text-muted-foreground text-xs">
                ثبت مشتری جدید
              </span>
            </span>
          </span>
        </button>
      }
    />
  )
}
