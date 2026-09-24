'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useCurrencyLabel } from '@/features/settings/components/settings-provider'
import { type computeTotals, money } from './lib'

type Totals = ReturnType<typeof computeTotals>

export function FormFooter({
  totals,
  discount,
  taxRate,
  isSubmitting,
  isEdit,
}: {
  totals: Totals
  discount: number
  taxRate: number
  isSubmitting: boolean
  isEdit: boolean
}) {
  const currencyLabel = useCurrencyLabel()

  return (
    <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-xl border bg-background/90 p-3 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/75 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <h2 className="text-muted-foreground text-sm">جمع کل</h2>
          <span className="font-black text-lg tabular-nums">
            {money(totals.total)}
          </span>
          <span className="text-muted-foreground text-xs">{currencyLabel}</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-muted-foreground text-xs">
          <span>جمع کالاها: {money(totals.subtotal)}</span>
          <span>تخفیف: {money(discount)}</span>
          <span>
            مالیات ({money(taxRate)}٪): {money(totals.tax)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 sm:flex-none"
          nativeButton={false}
          disabled={isSubmitting}
          render={<Link href="/dashboard/invoices" />}
        >
          انصراف
        </Button>
        <Button
          type="submit"
          className="flex-1 sm:flex-none"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner />}
          {isEdit ? 'ثبت تغییرات' : 'ثبت فاکتور'}
        </Button>
      </div>
    </div>
  )
}
