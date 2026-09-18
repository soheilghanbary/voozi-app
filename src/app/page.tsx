import {
  ArrowDown,
  Banknote,
  Boxes,
  Building2,
  FileText,
  Layers,
  LayoutDashboard,
  ReceiptText,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/landing/reveal'
import { SignInButton } from '@/components/landing/sign-in-button'
import { InvoicePrintDocument } from '@/features/invoice/components/invoice-print-document'
import type { InvoiceDetail } from '@/features/invoice/types'

export const metadata: Metadata = {
  title: 'وزیا | صدور فاکتور آنلاین',
  description:
    'فاکتور فروش و پیش‌فاکتور را با لوگو، امضا و برند خودتان بسازید، چاپ کنید و آمار فروش را ببینید.',
}

const container = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'

const previewInvoice: InvoiceDetail = {
  id: 'preview',
  number: 1042,
  type: 'invoice',
  customerId: 'c1',
  customerName: 'شرکت آریا پردازش',
  issueDate: '2026-09-14',
  dueDate: '2026-10-14',
  discount: 0,
  taxRate: 9,
  note: '',
  total: 0,
  createdAt: '2026-09-14T10:00:00.000Z',
  items: [
    {
      id: 'i1',
      productId: 'p1',
      name: 'طراحی وب‌سایت شرکتی',
      unit: 'پروژه',
      quantity: 1,
      unitPrice: 6_800_000,
      discount: 0,
    },
    {
      id: 'i2',
      productId: 'p2',
      name: 'میزبانی و دامنه سالانه',
      unit: 'سال',
      quantity: 1,
      unitPrice: 1_200_000,
      discount: 0,
    },
    {
      id: 'i3',
      productId: 'p3',
      name: 'نگهداری ماهانه',
      unit: 'ماه',
      quantity: 6,
      unitPrice: 350_000,
      discount: 0,
    },
  ],
}

const previewProfile = {
  name: 'استودیو مهر',
  title: 'طراحی و توسعه محصولات دیجیتال',
  phone: '۰۲۱-۱۲۳۴۵۶۷۸',
  currency: 'toman' as const,
}

function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <ReceiptText className="size-4.5" />
      </span>
      <span className="font-black text-lg tracking-tight">وزیا</span>
    </Link>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-dvh">
      <header className="sticky top-0 z-40 border-border/60 border-b bg-background/80 backdrop-blur">
        <div
          className={`${container} flex h-16 items-center justify-between gap-4`}
        >
          <Brand />
          <nav className="hidden items-center gap-6 text-muted-foreground text-sm sm:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              امکانات
            </Link>
            <Link
              href="#how"
              className="transition-colors hover:text-foreground"
            >
              چگونگی کار
            </Link>
          </nav>
          <SignInButton size="sm" />
        </div>
      </header>

      <section
        className={`${container} grid items-center gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20`}
      >
        <div>
          <Reveal>
            <h1 className="max-w-md text-balance font-black text-4xl leading-[1.2] tracking-tight sm:text-5xl sm:leading-[1.15]">
              صدور فاکتور، ساده و با برند خودتان
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-pretty text-muted-foreground leading-8">
              با وزیا فاکتور فروش و پیش‌فاکتور را با لوگو، امضا و برند خودتان
              بسازید، بین ریال و تومان جابه‌جا شوید و آمار فروش را در پیشخوان
              ببینید.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SignInButton size="lg" />
              <Link
                href="#features"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 font-medium text-sm transition-colors hover:bg-muted"
              >
                مشاهده امکانات
                <ArrowDown className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="rounded-2xl bg-muted/50 p-2.5 shadow-2xl shadow-foreground/5 sm:rounded-3xl sm:p-4 lg:p-3">
            <InvoicePrintDocument
              invoice={previewInvoice}
              profile={previewProfile}
            />
          </div>
        </Reveal>
      </section>

      <section id="features" className="scroll-mt-20 border-border/60 border-t">
        <div className={`${container} py-20 lg:py-28`}>
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-balance font-black text-3xl tracking-tight sm:text-4xl">
                همه‌چیز برای فاکتور، در یک پیشخوان
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground leading-8">
                از اقلام و مشتری‌ها تا امضا و چاپ سند، همه در یک برنامه.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
            <Reveal className="md:col-span-4" delay={0.05}>
              <div className="flex h-full flex-col rounded-2xl bg-primary/5 p-6 ring-1 ring-primary/10 sm:p-8">
                <Building2 className="size-6 text-primary" />
                <h3 className="mt-4 font-bold text-lg">برندینگ کامل روی سند</h3>
                <p className="mt-2 text-muted-foreground leading-7">
                  لوگو، امضا، شماره تماس و نام کسب‌وکارتان روی یک سند تمیز که
                  برای چاپ آماده است.
                </p>
                <div className="mt-6 rounded-xl bg-background p-4 ring-1 ring-border/70">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">استودیو مهر</p>
                        <p className="text-muted-foreground text-xs">
                          فاکتور فروش
                        </p>
                      </div>
                    </div>
                    <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary text-xs">
                      خروجی واقعی
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                    <span className="rounded-md bg-background px-2 py-1 font-medium ring-1 ring-border">
                      لوگوی اختصاصی
                    </span>
                    <span className="rounded-md bg-background px-2 py-1 font-medium ring-1 ring-border">
                      امضای دیجیتال
                    </span>
                    <span className="rounded-md bg-background px-2 py-1 font-medium ring-1 ring-border">
                      شماره تماس
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delay={0.1}>
              <div className="h-full rounded-2xl bg-muted/40 p-6 ring-1 ring-border">
                <Layers className="size-6 text-primary" />
                <h3 className="mt-4 font-bold text-lg">فاکتور و پیش‌فاکتور</h3>
                <p className="mt-2 text-muted-foreground leading-7">
                  هر دو نوع سند را بسازید و با یک کلیک بینشان جابه‌جا شوید.
                </p>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delay={0.05}>
              <div className="h-full rounded-2xl bg-amber-500/5 p-6 ring-1 ring-amber-500/15">
                <Banknote className="size-6 text-amber-600 dark:text-amber-400" />
                <h3 className="mt-4 font-bold text-lg">ریال یا تومان</h3>
                <p className="mt-2 text-muted-foreground leading-7">
                  واحد پول همیشگی‌تان را انتخاب کنید؛ همه مبلغ‌ها با همان حساب
                  می‌شود.
                </p>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delay={0.1}>
              <div className="h-full rounded-2xl bg-background p-6 ring-1 ring-border">
                <LayoutDashboard className="size-6 text-primary" />
                <h3 className="mt-4 font-bold text-lg">پیشخوان فروش</h3>
                <p className="mt-2 text-muted-foreground leading-7">
                  فروش کل و تعداد اسناد را در یک نگاه ببینید.
                </p>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delay={0.15}>
              <div className="h-full rounded-2xl bg-muted/40 p-6 ring-1 ring-border">
                <Boxes className="size-6 text-primary" />
                <h3 className="mt-4 font-bold text-lg">محصولات و مشتری‌ها</h3>
                <p className="mt-2 text-muted-foreground leading-7">
                  کاتالوگ محصولات با واحد و قیمت، و فهرست مشتری‌ها.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-20 border-border/60 border-t">
        <div className={`${container} py-20 lg:py-28`}>
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-balance font-black text-3xl tracking-tight sm:text-4xl">
                در سه گام، فاکتور آماده است
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground leading-8">
                از ورود تا چاپ سند، بدون هیچ پیچیدگی.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-x-reverse md:border-border md:border-x">
            {[
              {
                step: 'گام ۱',
                title: 'وارد پیشخوان شوید',
                text: 'با حساب گوگل وارد شوید؛ تنظیمات کسب‌وکارتان آماده است.',
              },
              {
                step: 'گام ۲',
                title: 'سندتان را بسازید',
                text: 'مشتری و اقلام را اضافه کنید؛ جمع، تخفیف و مالیات خودکار حساب می‌شود.',
              },
              {
                step: 'گام ۳',
                title: 'چاپ کنید',
                text: 'سند را آماده چاپ ببینید و با یک کلیک چاپ کنید.',
              },
            ].map((item) => (
              <div key={item.step} className="md:px-10">
                <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 font-bold text-primary text-xs">
                  {item.step}
                </span>
                <h3 className="mt-4 font-bold text-lg">{item.title}</h3>
                <p className="mt-2 text-muted-foreground leading-7">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border/60 border-t">
        <div className={`${container} py-20 lg:py-28`}>
          <Reveal>
            <div className="rounded-3xl border border-border bg-primary/5 px-6 py-16 text-center sm:px-16">
              <h2 className="mx-auto max-w-xl text-balance font-black text-3xl tracking-tight sm:text-4xl">
                همین حالا اولین فاکتورتان را صادر کنید
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground leading-8">
                فقط با حساب گوگل شروع کنید.
              </p>
              <div className="mt-8">
                <SignInButton size="lg" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-border/60 border-t">
        <div
          className={`${container} flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="flex flex-col gap-2">
            <Brand />
            <p className="text-muted-foreground text-xs">
              نرم‌افزار صدور فاکتور آنلاین
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              امکانات
            </Link>
            <Link
              href="#how"
              className="transition-colors hover:text-foreground"
            >
              چگونگی کار
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground"
            >
              پیشخوان
            </Link>
          </nav>
          <p className="text-muted-foreground text-xs">© ۱۴۰۵ وزیا</p>
        </div>
      </footer>
    </main>
  )
}
