import { Skeleton } from '@/components/ui/skeleton'

export function CustomersListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-full max-w-sm" />
        <Skeleton className="h-4 w-16" />
        <div className="ms-auto flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-52 rounded-xl" />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-2">
        <Skeleton className="h-8 w-36 rounded-md" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-40 rounded-md" />
      </div>
    </div>
  )
}
