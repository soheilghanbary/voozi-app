'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/server/orpc/client'
import { CURRENCY, type Currency } from '../types'

export function CurrencyForm({ currency }: { currency: Currency }) {
  const router = useRouter()
  const [value, setValue] = useState(currency)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currencyKeys = Object.keys(CURRENCY) as Currency[]

  async function handleSubmit() {
    if (value === currency) return
    setIsSubmitting(true)
    try {
      await api.settings.update({ currency: value })
      toast.success('واحد پول با موفقیت تغییر کرد.')
      router.refresh()
    } catch {
      toast.error('تغییر واحد پول ناموفق بود. دوباره تلاش کنید.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={value}
        onValueChange={setValue}
        className="sm:grid-cols-2"
      >
        {currencyKeys.map((key) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors has-aria-checked:border-primary has-aria-checked:bg-primary/5"
          >
            <RadioGroupItem value={key} />
            <span className="font-medium text-sm">{CURRENCY[key].label}</span>
          </label>
        ))}
      </RadioGroup>
      <p className="text-muted-foreground text-xs">
        قیمت‌ها و مبالغ در فرم‌ها و فاکتورها با این واحد نمایش داده می‌شوند.
      </p>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || value === currency}
      >
        {isSubmitting && <Spinner />}
        ذخیره
      </Button>
    </div>
  )
}
