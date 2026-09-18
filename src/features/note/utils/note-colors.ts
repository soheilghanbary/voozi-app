export const NOTE_COLORS = ['teal', 'indigo', 'yellow', 'rose'] as const

export type NoteColor = (typeof NOTE_COLORS)[number]

export const NOTE_COLOR_LABELS: Record<NoteColor, string> = {
  teal: 'فیروزه‌ای',
  indigo: 'نیلی',
  yellow: 'زرد',
  rose: 'سرخابی',
}

export const NOTE_COLOR_STYLES: Record<
  NoteColor,
  { edge: string; wash: string; hover: string; swatch: string }
> = {
  teal: {
    edge: 'border-teal-500',
    wash: 'bg-teal-500/[0.04] dark:bg-teal-400/[0.07]',
    hover: 'hover:ring-teal-500/25 hover:shadow-teal-500/10',
    swatch: 'bg-teal-500',
  },
  indigo: {
    edge: 'border-indigo-500',
    wash: 'bg-indigo-500/[0.04] dark:bg-indigo-400/[0.07]',
    hover: 'hover:ring-indigo-500/25 hover:shadow-indigo-500/10',
    swatch: 'bg-indigo-500',
  },
  yellow: {
    edge: 'border-yellow-500',
    wash: 'bg-yellow-500/[0.04] dark:bg-yellow-400/[0.07]',
    hover: 'hover:ring-yellow-500/25 hover:shadow-yellow-500/10',
    swatch: 'bg-yellow-500',
  },
  rose: {
    edge: 'border-rose-500',
    wash: 'bg-rose-500/[0.04] dark:bg-rose-400/[0.07]',
    hover: 'hover:ring-rose-500/25 hover:shadow-rose-500/10',
    swatch: 'bg-rose-500',
  },
}
