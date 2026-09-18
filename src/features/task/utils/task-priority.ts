export const PRIORITIES = ['low', 'medium', 'high'] as const

export type TaskPriority = (typeof PRIORITIES)[number]

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'کم',
  medium: 'متوسط',
  high: 'زیاد',
}

export const PRIORITY_STYLES: Record<
  TaskPriority,
  { badge: string; dot: string; toggle: string }
> = {
  low: {
    badge:
      'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    dot: 'bg-emerald-500',
    toggle: 'border-emerald-500 bg-emerald-500 text-white',
  },
  medium: {
    badge:
      'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20',
    dot: 'bg-amber-500',
    toggle: 'border-amber-500 bg-amber-500 text-white',
  },
  high: {
    badge:
      'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/20',
    dot: 'bg-rose-500',
    toggle: 'border-rose-500 bg-rose-500 text-white',
  },
}
