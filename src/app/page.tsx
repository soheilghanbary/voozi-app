import type { Metadata } from 'next'
import { Logo } from '@/assets/logo'
import { Reveal } from '@/components/landing/reveal'
import { SignInButton } from '@/components/landing/sign-in-button'

export const metadata: Metadata = {
  title: 'وزیا | صدور فاکتور آنلاین',
  description:
    'فاکتور فروش و پیش‌فاکتور را با لوگو، امضا و برند خودتان بسازید، چاپ کنید و آمار فروش را ببینید.',
}

export default function LandingPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      <section className="relative mx-auto w-full max-w-2xl py-24 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2.5">
            <Logo className="size-8" />
            <span className="font-black text-xl tracking-tight">وزیا</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 text-balance font-black text-4xl leading-tight tracking-tight sm:text-5xl sm:leading-[1.15]">
            صدور فاکتور، ساده و با برند خودتان
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-lg text-pretty text-muted-foreground leading-8">
            فاکتور فروش و پیش‌فاکتور را با لوگو، امضا و برند خودتان بسازید، بین
            ریال و تومان جابه‌جا شوید و آمار فروش را در پیشخوان ببینید.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex justify-center">
            <SignInButton size="lg" />
          </div>
        </Reveal>
      </section>
    </main>
  )
}
