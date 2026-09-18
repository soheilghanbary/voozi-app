export const CURRENCY = {
  toman: { label: 'تومان' },
  rial: { label: 'ریال' },
} as const

export type Currency = keyof typeof CURRENCY

export type BusinessProfile = {
  name: string | null
  title: string | null
  description: string | null
  logo: string | null
  signature: string | null
  phone: string | null
  tel: string | null
  website: string | null
  currency: Currency
  completed: boolean
}

export const CURRENCY_LABELS = Object.fromEntries(
  Object.entries(CURRENCY).map(([key, value]) => [key, value.label])
) as Record<Currency, string>
