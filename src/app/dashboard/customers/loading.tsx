import { DataTableSkeleton } from '@/components/data-table-skeleton'

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 pt-4">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      </div>
      <DataTableSkeleton rows={6} columns={6} />
    </div>
  )
}
