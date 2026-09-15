'use client'

import { ArrowRight, Printer } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PrintToolbar() {
  return (
    <div className="print:hidden">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/dashboard/invoices" />}
        >
          <ArrowRight />
          بازگشت به فاکتورها
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          <Printer />
          چاپ / ذخیره PDF
        </Button>
      </div>
    </div>
  )
}
