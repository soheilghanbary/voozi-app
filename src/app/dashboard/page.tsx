import { call } from '@orpc/server'
import {
  Banknote,
  ChevronLeft,
  Package,
  Plus,
  ReceiptText,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { listCustomers } from '@/features/customer/api/queries'
import { listInvoices } from '@/features/invoice/api/queries'
import { dateFormatter, numberFormatter } from '@/features/invoice/utils/format'
import { listProducts } from '@/features/product/api/queries'
import { QuickAddProductCard } from '@/features/product/components/quick-add-product-card'
import { getBusinessProfile } from '@/features/settings/api/queries'
import { CURRENCY } from '@/features/settings/types'
import { cn } from '@/lib/utils'

export const instant = false

export const metadata = {
  title: 'پیشخوان',
}

const money = (value: number) => numberFormatter.format(value)

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="font-black text-2xl tabular-nums tracking-tight">
            {value}
          </p>
          {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
        </div>
        <div
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-xl',
            accent
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default async function Page() {
  const [invoices, customers, products, profile] = await Promise.all([
    call(listInvoices),
    call(listCustomers),
    call(listProducts),
    call(getBusinessProfile),
  ])

  const currencyLabel = CURRENCY[profile.currency].label

  const invoiceCount = invoices.filter((i) => i.type === 'invoice').length
  const proformaCount = invoices.filter((i) => i.type === 'proforma').length
  const invoiceTotal = invoices
    .filter((i) => i.type === 'invoice')
    .reduce((sum, i) => sum + i.total, 0)
  const proformaTotal = invoices
    .filter((i) => i.type === 'proforma')
    .reduce((sum, i) => sum + i.total, 0)
  const grandTotal = invoices.reduce((sum, i) => sum + i.total, 0)

  const maxTotal = Math.max(invoiceTotal, proformaTotal, 1)
  const breakdown = [
    {
      label: 'فاکتور فروش',
      count: invoiceCount,
      total: invoiceTotal,
    },
    {
      label: 'پیش‌فاکتور',
      count: proformaCount,
      total: proformaTotal,
    },
  ]

  const recent = invoices.slice(0, 5)

  const quickActions = [
    {
      label: 'صادر کردن فاکتور',
      desc: 'فاکتور فروش یا پیش‌فاکتور جدید',
      href: '/dashboard/invoices/new',
      icon: <ReceiptText className="size-4.5" />,
    },
    {
      label: 'افزودن مشتری',
      desc: 'ثبت مشتری جدید',
      href: '/dashboard/customers/new',
      icon: <Users className="size-4.5" />,
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="پیشخوان"
        description={dateFormatter.format(new Date())}
      >
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/invoices/new" />}
        >
          <Plus />
          فاکتور جدید
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={`فروش کل (${currencyLabel})`}
          value={money(invoiceTotal)}
          sub={`بر اساس ${invoiceCount} فاکتور فروش`}
          icon={<Banknote className="size-5 text-primary" />}
          accent="bg-primary/10 text-primary"
        />
        <StatCard
          label="تعداد فاکتورها"
          value={money(invoices.length)}
          sub={`پیش‌فاکتور: ${money(proformaCount)}`}
          icon={<ReceiptText className="size-5 text-violet-600" />}
          accent="bg-violet-600/10 text-violet-600"
        />
        <StatCard
          label="مشتریان"
          value={money(customers.length)}
          icon={<Users className="size-5 text-emerald-600" />}
          accent="bg-emerald-600/10 text-emerald-600"
        />
        <StatCard
          label="محصولات"
          value={money(products.length)}
          icon={<Package className="size-5 text-amber-600" />}
          accent="bg-amber-600/10 text-amber-600"
        />
      </div>

      {invoices.length === 0 ? (
        <Card className="py-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ReceiptText className="size-7" />
            </div>
            <div>
              <p className="font-bold">هنوز فاکتوری صادر نشده است</p>
              <p className="mt-1 text-muted-foreground text-sm">
                اولین فاکتور خود را بسازید تا آمار اینجا نمایش داده شود.
              </p>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/invoices/new" />}
            >
              <Plus />
              ساخت فاکتور
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">آخرین فاکتورها</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                nativeButton={false}
                render={<Link href="/dashboard/invoices" />}
              >
                مشاهده همه
                <ChevronLeft />
              </Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {recent.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs',
                        invoice.type === 'invoice'
                          ? 'border-primary/20 bg-primary/5 text-primary'
                          : 'border-amber-500/20 bg-amber-500/5 text-amber-600'
                      )}
                    >
                      <span className="tabular-nums">
                        {money(invoice.number)}
                      </span>
                    </span>
                    <span className="truncate font-medium text-sm">
                      {invoice.customerName || 'مشتری حذف شده'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-muted-foreground text-xs sm:block">
                      {dateFormatter.format(new Date(invoice.issueDate))}
                    </span>
                    <span className="font-bold text-sm tabular-nums">
                      {money(invoice.total)}
                      <span className="ms-1 font-normal text-muted-foreground text-xs">
                        {currencyLabel}
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">خلاصه فروش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {breakdown.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold tabular-nums">
                      {money(item.total)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        item.label === 'فاکتور فروش'
                          ? 'bg-primary'
                          : 'bg-amber-500'
                      )}
                      style={{
                        width: `${Math.max(4, (item.total / maxTotal) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {money(item.count)} سند
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-muted-foreground text-sm">
                  جمع کل اسناد
                </span>
                <span className="font-black tabular-nums">
                  {money(grandTotal)}
                  <span className="ms-1 font-normal text-muted-foreground text-xs">
                    {currencyLabel}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((item) => (
          <Link key={item.href} href={item.href} className="group">
            <Card className="p-4 transition-colors group-hover:border-primary/30">
              <div className="flex items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        <QuickAddProductCard />
      </div>
    </div>
  )
}
