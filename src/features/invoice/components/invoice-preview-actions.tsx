'use client'

import { Check, Pencil, Printer, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function InvoicePreviewActions({ invoiceId }: { invoiceId: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      // Clipboard not available — ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<Link href={`/dashboard/invoices/${invoiceId}/edit`} />}
      >
        <Pencil />
        ویرایش
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopyLink}>
        {copied ? <Check className="text-emerald-500" /> : <Share2 />}
        {copied ? 'لینک کپی شد' : 'کپی لینک'}
      </Button>
      <Button size="sm" onClick={() => window.print()}>
        <Printer />
        چاپ / PDF
      </Button>
    </div>
  )
}
