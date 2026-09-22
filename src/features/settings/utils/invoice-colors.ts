export const INVOICE_COLORS = [
  'indigo',
  'sky',
  'emerald',
  'amber',
  'rose',
  'violet',
  'teal',
  'slate',
] as const

export type InvoiceColor = (typeof INVOICE_COLORS)[number]

export const INVOICE_COLOR_LABELS: Record<InvoiceColor, string> = {
  indigo: 'نیلی',
  sky: 'آبی آسمانی',
  emerald: 'زمردی',
  amber: 'کهربایی',
  rose: 'سرخابی',
  violet: 'بنفش',
  teal: 'فیروزه‌ای',
  slate: 'سربی',
}

export const INVOICE_COLOR_STYLES: Record<
  InvoiceColor,
  {
    swatch: string
    bar: string
    soft: string
    headerTint: string
    accentText: string
  }
> = {
  indigo: {
    swatch: 'bg-indigo-500',
    bar: 'bg-linear-to-l from-indigo-600 via-indigo-400 to-indigo-100',
    soft: 'bg-indigo-500/5 ring-indigo-500/15',
    headerTint: 'bg-indigo-50',
    accentText: 'text-indigo-600',
  },
  sky: {
    swatch: 'bg-sky-500',
    bar: 'bg-linear-to-l from-sky-600 via-sky-400 to-sky-100',
    soft: 'bg-sky-500/5 ring-sky-500/15',
    headerTint: 'bg-sky-50',
    accentText: 'text-sky-600',
  },
  emerald: {
    swatch: 'bg-emerald-500',
    bar: 'bg-linear-to-l from-emerald-600 via-emerald-400 to-emerald-100',
    soft: 'bg-emerald-500/5 ring-emerald-500/15',
    headerTint: 'bg-emerald-50',
    accentText: 'text-emerald-600',
  },
  amber: {
    swatch: 'bg-amber-500',
    bar: 'bg-linear-to-l from-amber-600 via-amber-400 to-amber-100',
    soft: 'bg-amber-500/5 ring-amber-500/15',
    headerTint: 'bg-amber-50',
    accentText: 'text-amber-600',
  },
  rose: {
    swatch: 'bg-rose-500',
    bar: 'bg-linear-to-l from-rose-600 via-rose-400 to-rose-100',
    soft: 'bg-rose-500/5 ring-rose-500/15',
    headerTint: 'bg-rose-50',
    accentText: 'text-rose-600',
  },
  violet: {
    swatch: 'bg-violet-500',
    bar: 'bg-linear-to-l from-violet-600 via-violet-400 to-violet-100',
    soft: 'bg-violet-500/5 ring-violet-500/15',
    headerTint: 'bg-violet-50',
    accentText: 'text-violet-600',
  },
  teal: {
    swatch: 'bg-teal-500',
    bar: 'bg-linear-to-l from-teal-600 via-teal-400 to-teal-100',
    soft: 'bg-teal-500/5 ring-teal-500/15',
    headerTint: 'bg-teal-50',
    accentText: 'text-teal-600',
  },
  slate: {
    swatch: 'bg-slate-500',
    bar: 'bg-linear-to-l from-slate-600 via-slate-400 to-slate-100',
    soft: 'bg-slate-500/5 ring-slate-500/15',
    headerTint: 'bg-slate-50',
    accentText: 'text-slate-600',
  },
}
