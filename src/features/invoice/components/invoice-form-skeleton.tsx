import { Skeleton } from '@/components/ui/skeleton'

export function InvoiceFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pt-0 rtl:flex-row">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="h-6 w-36" />
      </div>
      <div className="rounded-xl border bg-card">
        <div className="space-y-2 p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-56" />
        </div>
        <div className="space-y-6 px-6 pb-6">
          <div className="space-x-2">
            <Skeleton className="inline-block h-9 w-28 rounded-md" />
            <Skeleton className="inline-block h-9 w-28 rounded-md" />
          </div>
          <div className="grid gap-5 md:grid-cols-12">
            <Skeleton className="h-9 rounded-md md:col-span-6" />
            <Skeleton className="h-9 rounded-md md:col-span-3" />
            <Skeleton className="h-9 rounded-md md:col-span-3" />
          </div>
          <div className="space-y-3 rounded-lg border bg-card/60 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-8 w-28 rounded-md" />
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="space-y-3 rounded-lg border bg-background p-3"
              >
                <Skeleton className="h-9 rounded-md" />
                <Skeleton className="h-9 rounded-md lg:hidden" />
                <div className="grid grid-cols-2 gap-3 lg:hidden">
                  <Skeleton className="h-9 rounded-md" />
                  <Skeleton className="h-9 rounded-md" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-24 rounded-md" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3.5 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}
