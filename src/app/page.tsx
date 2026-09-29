import { ListTodo, Package, StickyNote, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { Logo } from '@/assets/logo'
import { PreviewDemo } from '@/components/landing/preview-demo'
import { Reveal } from '@/components/landing/reveal'
import { ModeToggle } from '@/components/mode-toggle'
import { OAuthButton } from '@/components/oauth-button'
import { Button } from '@/components/ui/button'
import { Marquee } from '@/components/ui/marquee'

export const metadata: Metadata = {
  title: 'ووزی | صدور فاکتور آنلاین',
  description:
    'فاکتور فروش و پیش‌فاکتور را با لوگو، امضا و رنگ دلخواه بسازید، بین ریال و تومان جابه‌جا شوید و چاپ کنید.',
}

const navLinks = [
  { href: '#features', label: 'امکانات' },
  { href: '#how', label: 'روش کار' },
  { href: '#testimonials', label: 'نظرات' },
]

const features = [
  {
    title: 'برند شما، روی هر سند',
    description:
      'لوگو، عنوان، توضیحات و تم رنگی را از تنظیمات پیکربندی کن تا همه فاکتورها یکدست و حرفه‌ای چاپ شوند.',
  },
  {
    title: 'ریال یا تومان، با یک کلیک',
    description:
      'واحد پول را یک بار انتخاب کن؛ در همه فرم‌ها، پیش‌نمایش و چاپ به همین شکل اعمال می‌شود.',
  },
  {
    title: 'هشت تم رنگی آماده',
    description:
      'رنگ فاکتور را با برند خودت هماهنگ کن؛ روی پیش‌نمایش، چاپ و سند صادرشده یکسان است.',
  },
  {
    title: 'همه‌چیز در یک پیشخوان',
    description:
      'مشتریان، کالاها و خدمات، یادداشت‌ها و وظایف، کنار فاکتورهایت؛ بدون جابه‌جایی بین ابزارها.',
  },
]

const steps = [
  {
    number: '۰۱',
    title: 'فاکتور را با ردیف‌هایش بساز',
    description:
      'کالا یا خدمت را انتخاب کن، تعداد و قیمت را وارد کن و تخفیف و مالیات را مشخص کن.',
  },
  {
    number: '۰۲',
    title: 'برند و تنظیمات را هماهنگ کن',
    description:
      'لوگو، امضا، واحد پول و رنگ فاکتور را از یک صفحه تنظیم کن؛ بدون هیچ دانش فنی.',
  },
  {
    number: '۰۳',
    title: 'بررسی کن، چاپ کن یا ذخیره کن',
    description:
      'پیش‌نمایش زنده را ببین و خروجی تمیز چاپ یا ذخیره کن؛ بدون تنظیمات اضافه.',
  },
]

const testimony = {
  featured: {
    quote:
      'با ووزی برای اولین بار فاکتورهای فروشگاهم را خودم صادر می‌کنم؛ لوگو و رنگ برند روی همه سندها یکدست می‌آید.',
    name: 'مریم احمدی',
    role: 'مدیر فروشگاه آنلاین',
  },
  items: [
    {
      quote:
        'بین ریال و تومان را با یک کلیک عوض می‌کنم و پیش‌فاکتور خیلی سریع حاضر است.',
      name: 'رضا کریمی',
      role: 'فریلنسر',
    },
    {
      quote:
        'رنگ فاکتور را هماهنگ با برند کافه گذاشتم؛ مشتری‌ها هم متوجه همین می‌شوند.',
      name: 'سارا موسوی',
      role: 'مدیر کافه',
    },
  ],
}

export default function LandingPage() {
  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-60 bg-noise opacity-[0.03]"
      />

      <header className="sticky top-0 z-40 border-border/70 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-foreground"
            aria-label="ووزی"
          >
            <Logo className="size-8 text-primary" />
            <span className="font-black text-lg tracking-tight">ووزی</span>
          </a>
          <nav
            aria-label="لینک‌های صفحه"
            className="hidden items-center gap-7 text-muted-foreground text-sm md:flex"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <OAuthButton />
          </div>
        </div>
      </header>
      <section
        id="top"
        className="relative mx-auto w-full max-w-6xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-136 bg-[radial-gradient(58%_50%_at_50%_0%,oklch(0.5817_0.1965_258.31/0.09),transparent_72%)]"
        />
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <Reveal>
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-muted-foreground text-xs">
                <span className="size-1.5 rounded-full bg-primary" />
                هر فاکتور، با برند شما
              </span>
              <h1 className="mt-6 text-balance font-black text-[2.5rem] leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
                صدور فاکتور، همین‌قدر ساده و حرفه‌ای
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-muted-foreground leading-8">
                فاکتور و پیش‌فاکتور را با لوگو و رنگ برندت بساز، بین ریال و تومان
                جابه‌جا شو و همه‌چیز را از یک پیشخوان مدیریت کن.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <OAuthButton />
                <Button
                  variant="outline"
                  size="lg"
                  nativeButton={false}
                  render={<a href="#features" />}
                >
                  مشاهده امکانات
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="w-full max-w-lg lg:max-w-none">
              <PreviewDemo />
            </div>
          </Reveal>
        </div>
      </section>
      <section
        aria-label="قابلیت‌ها"
        className="relative flex w-full flex-col items-center justify-center overflow-hidden border-border/70 border-y bg-card/40 py-4"
      >
        <Marquee className="[--duration:26s]">
          {[
            'فاکتور فروش',
            'پیش‌فاکتور',
            'مشتریان',
            'کالا و خدمات',
            'یادداشت‌ها',
            'وظایف',
            'چاپ با برند',
            'ریال و تومان',
            'هشت تم رنگی',
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground text-xs"
            >
              <span className="size-1.5 rounded-full bg-primary/60" />
              {item}
            </span>
          ))}
        </Marquee>
      </section>
      <section
        id="features"
        className="mx-auto w-full max-w-6xl px-6 py-24 lg:py-32"
      >
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-balance font-black text-3xl leading-tight tracking-tight sm:text-4xl">
              هر آنچه برای صدور فاکتور لازم داری، یکجا
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground leading-7">
              از پردازش فاکتور تا مدیریت مشتری و محصولات؛ بدون ابزارهای پراکنده
              و فرمت‌های پیچیده.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-linear-to-br from-20% from-primary/8 via-card to-card p-8">
              <h3 className="text-pretty font-black text-xl">
                {features[0].title}
              </h3>
              <p className="mt-3 max-w-md text-muted-foreground leading-7">
                {features[0].description}
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-4">
                <div className="grid size-11 place-items-center rounded-xl bg-primary/10">
                  <Logo className="size-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">ووزی</p>
                  <p className="text-muted-foreground text-xs">
                    سامانه صدور فاکتور
                  </p>
                </div>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-primary/10 blur-3xl"
              />
            </div>
          </Reveal>
          <Reveal className="md:col-span-5" delay={0.06}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-8">
              <div>
                <h3 className="text-pretty font-black text-xl">
                  {features[1].title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-7">
                  {features[1].description}
                </p>
              </div>
              <div className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2">
                <span className="text-muted-foreground text-sm">جمع کل</span>
                <span className="font-black tabular-nums">۱۲٬۴۰۰٬۰۰۰</span>
                <span className="text-muted-foreground text-xs">تومان</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="md:col-span-5" delay={0.06}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-8">
              <div>
                <h3 className="text-pretty font-black text-xl">
                  {features[2].title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-7">
                  {features[2].description}
                </p>
              </div>
              <div
                role="list"
                aria-label="رنگ‌های فاکتور"
                className="mt-8 flex flex-wrap items-center gap-2"
              >
                {[
                  'نیلی',
                  'آبی',
                  'زمردی',
                  'کهربایی',
                  'سرخابی',
                  'بنفش',
                  'فیروزه‌ای',
                  'سربی',
                ].map((label) => (
                  <span
                    key={label}
                    role="listitem"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-muted-foreground text-xs"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal className="md:col-span-7" delay={0.12}>
            <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-8 md:flex-row">
              <div className="max-w-sm">
                <h3 className="text-pretty font-black text-xl">
                  {features[3].title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-7">
                  {features[3].description}
                </p>
              </div>
              <ul className="flex w-full max-w-xs flex-col gap-2">
                {[
                  { icon: Users, label: 'مشتریان' },
                  { icon: Package, label: 'کالا و خدمات' },
                  { icon: StickyNote, label: 'یادداشت‌ها' },
                  { icon: ListTodo, label: 'وظایف' },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm"
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="font-medium">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="how"
        className="mx-auto w-full max-w-6xl px-6 pb-24 lg:pb-32"
      >
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-balance font-black text-3xl leading-tight tracking-tight sm:text-4xl">
              از صفر تا چاپ، در سه گام
            </h2>
          </div>
        </Reveal>
        <ol className="mt-12">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.05}>
              <li className="grid gap-4 border-border border-t py-9 md:grid-cols-[7rem_1fr] md:gap-10">
                <span className="font-black text-4xl text-primary tabular-nums">
                  {step.number}
                </span>
                <div className="max-w-2xl">
                  <h3 className="font-bold text-lg sm:text-xl">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-7">
                    {step.description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section
        id="testimonials"
        className="border-border/70 border-t bg-muted/30 py-24 lg:py-32"
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <Reveal>
            <h2 className="max-w-3xl text-balance font-black text-3xl leading-tight tracking-tight sm:text-4xl">
              از فریلنسر تا فروشگاه، همه با ووزی فاکتور صادر می‌کنند
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <blockquote className="mt-12 max-w-3xl">
              <p className="text-pretty font-bold text-2xl leading-relaxed sm:text-3xl">
                «{testimony.featured.quote}»
              </p>
              <footer className="mt-5 text-sm">
                <span className="font-bold">{testimony.featured.name}،</span>{' '}
                <span className="text-muted-foreground">
                  {testimony.featured.role}
                </span>
              </footer>
            </blockquote>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {testimony.items.map((item, index) => (
              <Reveal key={item.name} delay={0.06 + index * 0.05}>
                <figure className="h-full bg-background p-8">
                  <blockquote className="max-w-md text-pretty text-muted-foreground leading-8">
                    «{item.quote}»
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-bold">{item.name}،</span>{' '}
                    <span className="text-muted-foreground">{item.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-24 lg:pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary/9 via-card to-card px-8 py-16 text-center sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance font-black text-3xl leading-tight tracking-tight sm:text-4xl">
                فاکتور بعدی‌ات را با برند خودت صادر کن
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground leading-7">
                با گوگل وارد شو و همین امروز اولین فاکتورت را بساز، چاپ کن یا
                ذخیره کن.
              </p>
              <div className="mt-9 flex justify-center">
                <OAuthButton />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-border/70 border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 px-6 py-10 text-sm sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
            <div className="flex items-center gap-2">
              <Logo className="size-6 text-primary" />
              <span className="font-black tracking-tight">ووزی</span>
            </div>
            <span className="text-muted-foreground">
              صدور فاکتور با برند شما
            </span>
          </div>
          <nav
            aria-label="لینک‌های پایین صفحه"
            className="flex items-center gap-5 text-muted-foreground"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-muted-foreground">© ۱۴۰۵ ووزی</p>
        </div>
      </footer>
    </main>
  )
}
