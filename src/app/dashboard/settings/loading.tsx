export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pt-4">
        <div className="size-8 animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-28 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-card p-6">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="size-9 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-64 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-9 animate-pulse rounded-md bg-muted/60" />
                <div className="h-9 animate-pulse rounded-md bg-muted/60" />
                <div className="h-24 animate-pulse rounded-md bg-muted/60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
