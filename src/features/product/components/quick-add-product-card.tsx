'use client'

import { Package } from 'lucide-react'
import { ProductFormDialog } from './product-form-dialog'

export function QuickAddProductCard() {
  return (
    <ProductFormDialog
      trigger={
        <button
          type="button"
          className="group w-full cursor-pointer rounded-xl border bg-card p-4 text-start outline-none transition-colors hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <Package className="size-4.5" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-sm">ثبت محصول</span>
              <span className="block text-muted-foreground text-xs">
                افزودن محصول یا خدمات
              </span>
            </span>
          </span>
        </button>
      }
    />
  )
}
