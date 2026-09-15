'use client'

import { ArrowRight, Printer } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PrintToolbar() {
  return (
    <div className="print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
        <p className="text-xs text-zinc-500">
          پیش‌نمایش فاکتور — با «چاپ / ذخیره PDF» نسخه PDF فاکتور را دریافت کنید.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            nativeButton={false}
            render={<Link href="/dashboard/invoices" />}
          >
            <ArrowRight />
            بازگشت به فاکتورها
          </Button>
          <Button size="sm" className="h-8" onClick={() => window.print()}>
            <Printer />
            چاپ / ذخیره PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
