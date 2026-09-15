'use client'

import { ArrowRight, Check, Printer, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function PrintToolbar() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      // Clipboard not available — ignore
    }
  }

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
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleShare}
          >
            {copied ? <Check className="text-emerald-500" /> : <Share2 />}
            {copied ? 'لینک کپی شد' : 'کپی لینک'}
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
