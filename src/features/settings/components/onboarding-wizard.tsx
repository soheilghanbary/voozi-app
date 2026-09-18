'use client'

import { ArrowLeft, Building2, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { TextField } from '@/components/ui/text-field'
import { cn } from '@/lib/utils'
import { api } from '@/server/orpc/client'
import { type BusinessProfile, CURRENCY, type Currency } from '../types'

const STEPS = [
  { label: 'شروع' },
  { label: 'کسب‌وکار' },
  { label: 'واحد پول' },
  { label: 'پایان' },
] as const

export function OnboardingWizard({ profile }: { profile: BusinessProfile }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(profile.name ?? '')
  const [title, setTitle] = useState(profile.title ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [website, setWebsite] = useState(profile.website ?? '')
  const [currency, setCurrency] = useState<Currency>(profile.currency)
  const [nameError, setNameError] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  function goNext() {
    if (step === 1) {
      if (!name.trim()) {
        setNameError('نام کسب‌وکار را وارد کنید.')
        return
      }
      setNameError(undefined)
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1))
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
  }

  async function handleFinish() {
    if (!name.trim()) {
      setNameError('نام کسب‌وکار را وارد کنید.')
      setStep(1)
      return
    }
    setIsSubmitting(true)
    try {
      await api.settings.update({
        name: name.trim(),
        title: title.trim() || undefined,
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        currency,
      })
      setStep(3)
    } catch {
      toast.error('ثبت موارد ناموفق بود. دوباره تلاش کنید.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function enterDashboard() {
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <ol className="flex items-center justify-between gap-2">
        {STEPS.map((item, index) => (
          <li key={item.label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => index < step && setStep(index)}
              disabled={index >= step}
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full font-bold text-xs tabular-nums transition-colors',
                index === step
                  ? 'bg-primary text-primary-foreground'
                  : index < step
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {index + 1}
            </button>
            <span
              className={cn(
                'hidden font-medium text-xs sm:block',
                index === step ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        {step === 0 && (
          <div className="text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="size-8" />
            </div>
            <h1 className="mt-5 font-black text-2xl tracking-tight">
              به وزیا خوش آمدید
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-pretty text-muted-foreground leading-7">
              در چند قدم کوتاه، کسب‌وکار خود را معرفی کنید تا فاکتورها را با برند
              خودتان صادر کنید.
            </p>
            <Button size="lg" className="mt-8 w-full" onClick={goNext}>
              شروع کنیم
            </Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="font-black text-xl tracking-tight">
              کسب‌وکار خود را معرفی کنید
            </h1>
            <p className="mt-1.5 text-muted-foreground text-sm">
              این اطلاعات روی فاکتورهای شما نمایش داده می‌شوند.
            </p>
            <div className="mt-6 space-y-4">
              <TextField
                label="نام کسب‌وکار"
                placeholder="مثلاً: فروشگاه آفتاب"
                error={nameError}
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  if (nameError) setNameError(undefined)
                }}
              />
              <TextField
                label="عنوان (اختیاری)"
                placeholder="مثلاً: فروش عمده و خرده"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <TextField
                label="تلفن همراه (اختیاری)"
                placeholder="مثلاً: ۰۹۱۲۳۴۵۶۷۸۹"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <TextField
                label="وب‌سایت (اختیاری)"
                placeholder="https://example.com"
                inputMode="url"
                dir="ltr"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>
            <div className="mt-8 flex items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={goBack}>
                بازگشت
              </Button>
              <Button type="button" onClick={goNext}>
                بعدی
                <ArrowLeft />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-black text-xl tracking-tight">
              واحد پول را انتخاب کنید
            </h1>
            <p className="mt-1.5 text-muted-foreground text-sm">
              قیمت‌ها و مبالغ فاکتورها با این واحد نمایش داده می‌شوند.
            </p>
            <RadioGroup
              value={currency}
              onValueChange={(value) => setCurrency(value as Currency)}
              className="mt-6"
            >
              {(Object.keys(CURRENCY) as Currency[]).map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors has-aria-checked:border-primary has-aria-checked:bg-primary/5"
                >
                  <RadioGroupItem value={key} />
                  <span className="font-medium">{CURRENCY[key].label}</span>
                </label>
              ))}
            </RadioGroup>
            <div className="mt-8 flex items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={goBack}>
                بازگشت
              </Button>
              <Button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'در حال ثبت…' : 'ثبت و ادامه'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <LayoutDashboard className="size-8" />
            </div>
            <h1 className="mt-5 font-black text-2xl tracking-tight">
              همه‌چیز آماده است
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-pretty text-muted-foreground leading-7">
              اولین فاکتور را صادر کنید یا از پیشخوان، کسب‌وکار خود را ببینید.
            </p>
            <Button size="lg" className="mt-8 w-full" onClick={enterDashboard}>
              ورود به پیشخوان
              <ArrowLeft />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
