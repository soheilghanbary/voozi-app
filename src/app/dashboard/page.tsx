import { call } from '@orpc/server'
import {
  Banknote,
  Check,
  ChevronLeft,
  Package,
  Plus,
  ReceiptText,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { listCustomers } from '@/features/customer/api/queries'
import { QuickAddCustomerCard } from '@/features/customer/components/quick-add-customer-card'
import type { Customer } from '@/features/customer/types'
import { listInvoices } from '@/features/invoice/api/queries'
import type { Invoice } from '@/features/invoice/types'
import { dateFormatter, numberFormatter } from '@/features/invoice/utils/format'
import { listNotes } from '@/features/note/api/queries'
import type { Note } from '@/features/note/types'
import { dateFormatter as noteDateFormatter } from '@/features/note/utils/format'
import { NOTE_COLOR_STYLES } from '@/features/note/utils/note-colors'
import { listProducts } from '@/features/product/api/queries'
import { QuickAddProductCard } from '@/features/product/components/quick-add-product-card'
import type { Product } from '@/features/product/types'
import { getBusinessProfile } from '@/features/settings/api/queries'
import { type BusinessProfile, CURRENCY } from '@/features/settings/types'
import { listTasks } from '@/features/task/api/queries'
import type { Task } from '@/features/task/types'
import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
} from '@/features/task/utils/task-priority'
import { cn } from '@/lib/utils'

export const instant = false

export const metadata = {
  title: 'پیشخوان',
}

const money = (value: number) => numberFormatter.format(value)

type InvoicesPromise = Promise<Invoice[]>
type CustomersPromise = Promise<Customer[]>
type ProductsPromise = Promise<Product[]>
type TasksPromise = Promise<Task[]>
type NotesPromise = Promise<Note[]>
type ProfilePromise = Promise<BusinessProfile>

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  className,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  accent: string
  className?: string
}) {
  return (
    <Card className={cn('p-4', className)}>
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

function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-lg border p-4">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-7 w-28 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

function SalesOverviewSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="space-y-3 rounded-lg border p-5 xl:col-span-2">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-10 animate-pulse rounded-lg bg-muted/60"
          />
        ))}
      </div>
      <div className="space-y-3 rounded-lg border p-5">
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-9 animate-pulse rounded-lg bg-muted/60"
          />
        ))}
      </div>
    </div>
  )
}

function RecentActivitySkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-lg border p-5">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="h-10 animate-pulse rounded-lg bg-muted/60"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

async function StatCardsSection({
  invoices,
  customers,
  products,
  profile,
}: {
  invoices: InvoicesPromise
  customers: CustomersPromise
  products: ProductsPromise
  tasks: TasksPromise
  profile: ProfilePromise
}) {
  const [invoicesData, customersData, productsData, profileData] =
    await Promise.all([invoices, customers, products, profile])

  const currencyLabel = CURRENCY[profileData.currency].label
  const invoiceCount = invoicesData.filter((i) => i.type === 'invoice').length
  const proformaCount = invoicesData.filter((i) => i.type === 'proforma').length
  const invoiceTotal = invoicesData
    .filter((i) => i.type === 'invoice')
    .reduce((sum, i) => sum + i.total, 0)

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <StatCard
        label={`فروش کل (${currencyLabel})`}
        value={money(invoiceTotal)}
        sub={`بر اساس ${invoiceCount} فاکتور فروش`}
        icon={<Banknote className="size-5 text-primary" />}
        accent="bg-primary/10 text-primary"
        className="md:col-span-3 lg:col-span-1"
      />
      <StatCard
        label="تعداد فاکتورها"
        value={money(invoicesData.length)}
        sub={`پیش‌فاکتور: ${money(proformaCount)}`}
        icon={<ReceiptText className="size-5 text-violet-600" />}
        accent="bg-violet-600/10 text-violet-600"
      />
      <StatCard
        label="مشتریان"
        value={money(customersData.length)}
        icon={<Users className="size-5 text-emerald-600" />}
        accent="bg-emerald-600/10 text-emerald-600"
      />
      <StatCard
        label="محصولات"
        value={money(productsData.length)}
        icon={<Package className="size-5 text-amber-600" />}
        accent="bg-amber-600/10 text-amber-600"
      />
    </div>
  )
}

async function SalesOverviewSection({
  invoices,
  profile,
}: {
  invoices: InvoicesPromise
  profile: ProfilePromise
}) {
  const [invoicesData, profileData] = await Promise.all([invoices, profile])

  const currencyLabel = CURRENCY[profileData.currency].label
  const invoiceCount = invoicesData.filter((i) => i.type === 'invoice').length
  const proformaCount = invoicesData.filter((i) => i.type === 'proforma').length
  const invoiceTotal = invoicesData
    .filter((i) => i.type === 'invoice')
    .reduce((sum, i) => sum + i.total, 0)
  const proformaTotal = invoicesData
    .filter((i) => i.type === 'proforma')
    .reduce((sum, i) => sum + i.total, 0)
  const grandTotal = invoicesData.reduce((sum, i) => sum + i.total, 0)

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

  const recent = invoicesData.slice(0, 5)

  if (invoicesData.length === 0) {
    return (
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
    )
  }

  return (
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
                  <span className="tabular-nums">{money(invoice.number)}</span>
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
                    item.label === 'فاکتور فروش' ? 'bg-primary' : 'bg-amber-500'
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
            <span className="text-muted-foreground text-sm">جمع کل اسناد</span>
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
  )
}

async function RecentActivitySection({
  tasks,
  notes,
}: {
  tasks: TasksPromise
  notes: NotesPromise
}) {
  const [tasksData, notesData] = await Promise.all([tasks, notes])

  const recentTasks = tasksData.slice(0, 4)
  const recentNotes = notesData.slice(0, 4)

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">آخرین وظایف</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            nativeButton={false}
            render={<Link href="/dashboard/tasks" />}
          >
            مشاهده همه
            <ChevronLeft />
          </Button>
        </CardHeader>
        <CardContent className="space-y-1">
          {recentTasks.length ? (
            recentTasks.map((task) => {
              const completed = !!task.completedAt
              return (
                <Link
                  key={task.id}
                  href="/dashboard/tasks"
                  className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <span
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors',
                      completed
                        ? PRIORITY_STYLES[task.priority].toggle
                        : 'border-input'
                    )}
                  >
                    {completed && (
                      <Check className="size-3" strokeWidth={3.5} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block truncate font-medium text-sm',
                        completed && 'text-muted-foreground line-through'
                      )}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="block truncate text-muted-foreground text-xs">
                        {task.description}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium text-xs ring-1 ring-inset',
                      PRIORITY_STYLES[task.priority].badge
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'size-1.5 rounded-full',
                        PRIORITY_STYLES[task.priority].dot
                      )}
                    />
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                </Link>
              )
            })
          ) : (
            <EmptyActivityRow text="هنوز وظیفه‌ای ثبت نشده است" />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">آخرین یادداشت‌ها</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            nativeButton={false}
            render={<Link href="/dashboard/notes" />}
          >
            مشاهده همه
            <ChevronLeft />
          </Button>
        </CardHeader>
        <CardContent className="space-y-1">
          {recentNotes.length ? (
            recentNotes.map((note) => (
              <Link
                key={note.id}
                href="/dashboard/notes"
                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
              >
                <span
                  aria-hidden
                  className={cn(
                    'h-7 w-1 shrink-0 rounded-full',
                    NOTE_COLOR_STYLES[note.color].edge.replace('border-', 'bg-')
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-sm">
                    {note.title}
                  </span>
                  <span className="block truncate text-muted-foreground text-xs">
                    {note.content || 'بدون متن'}
                  </span>
                </span>
                <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                  {noteDateFormatter.format(new Date(note.updatedAt))}
                </span>
              </Link>
            ))
          ) : (
            <EmptyActivityRow text="هنوز یادداشتی ثبت نشده است" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyActivityRow({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg px-2 py-8 text-muted-foreground text-sm">
      {text}
    </div>
  )
}

function QuickActionsSection() {
  const quickActions = [
    {
      label: 'صادر کردن فاکتور',
      desc: 'فاکتور فروش یا پیش‌فاکتور جدید',
      href: '/dashboard/invoices/new',
      icon: <ReceiptText className="size-4.5" />,
    },
  ]

  return (
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
      <QuickAddCustomerCard />
      <QuickAddProductCard />
    </div>
  )
}

export default async function Page() {
  await connection()

  const invoices = Promise.resolve(call(listInvoices))
  const customers = Promise.resolve(call(listCustomers))
  const products = Promise.resolve(call(listProducts))
  const tasks = Promise.resolve(call(listTasks))
  const notes = Promise.resolve(call(listNotes))
  const profile = Promise.resolve(call(getBusinessProfile))

  return (
    <div className="space-y-4">
      <PageHeader
        title="پیشخوان"
        description={dateFormatter.format(new Date())}
      />
      <Suspense fallback={<StatCardsSkeleton />}>
        <StatCardsSection
          invoices={invoices}
          customers={customers}
          products={products}
          tasks={tasks}
          profile={profile}
        />
      </Suspense>

      <Suspense fallback={<SalesOverviewSkeleton />}>
        <SalesOverviewSection invoices={invoices} profile={profile} />
      </Suspense>

      <Suspense fallback={<RecentActivitySkeleton />}>
        <RecentActivitySection tasks={tasks} notes={notes} />
      </Suspense>

      <QuickActionsSection />
    </div>
  )
}
