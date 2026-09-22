'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { api } from '@/server/orpc/client'
import {
  INVOICE_COLOR_LABELS,
  INVOICE_COLOR_STYLES,
  INVOICE_COLORS,
  type InvoiceColor,
} from '../utils/invoice-colors'

export function InvoiceColorForm({
  invoiceColor,
}: {
  invoiceColor: InvoiceColor
}) {
  const router = useRouter()
  const [value, setValue] = useState(invoiceColor)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    if (value === invoiceColor) return
    setIsSubmitting(true)
    try {
      await api.settings.update({ invoiceColor: value })
      toast.success('رنگ فاکتور با موفقیت تغییر کرد.')
      router.refresh()
    } catch {
      toast.error('تغییر رنگ فاکتور ناموفق بود. دوباره تلاش کنید.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={value}
        onValueChange={(next) => setValue(next as InvoiceColor)}
        className="grid grid-cols-4 gap-2"
      >
        {INVOICE_COLORS.map((key) => (
          <label
            key={key}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 transition-colors has-aria-checked:border-primary has-aria-checked:bg-primary/5"
          >
            <RadioGroupItem value={key} className="sr-only" />
            <span
              className={cn(
                'size-7 rounded-full shadow-inner ring-1 ring-black/5 transition-transform',
                INVOICE_COLOR_STYLES[key].swatch,
                value === key && 'scale-110 ring-2 ring-primary ring-offset-2'
              )}
            />
            <span className="font-medium text-xs">
              {INVOICE_COLOR_LABELS[key]}
            </span>
          </label>
        ))}
      </RadioGroup>
      <p className="text-muted-foreground text-xs">
        این رنگ برای نوار بالایی، بخش مبلغ نهایی و سطرهای جدول در پیش‌نمایش و چاپ
        فاکتور استفاده می‌شود.
      </p>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || value === invoiceColor}
      >
        {isSubmitting ? 'در حال ذخیره…' : 'ذخیره'}
      </Button>
    </div>
  )
}
