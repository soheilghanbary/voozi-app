export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 pt-4">
        <div className="space-y-1.5">
          <div className="h-6 w-36 animate-pulse rounded bg-muted" />
          <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-lg border p-4">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-7 w-28 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-3 rounded-lg border p-5 xl:col-span-2">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 animate-pulse rounded-lg bg-muted/60"
            />
          ))}
        </div>
        <div className="space-y-3 rounded-lg border p-5">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-9 animate-pulse rounded-lg bg-muted/60"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
