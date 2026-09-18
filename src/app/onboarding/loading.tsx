export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-6 size-8 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-4 rounded-2xl border bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="size-7 animate-pulse rounded-full bg-muted"
              />
            ))}
          </div>
          <div className="space-y-3 pt-4">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-2xl bg-muted" />
            <div className="mx-auto h-6 w-48 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-4 w-64 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded-md bg-muted/60" />
          </div>
        </div>
      </div>
    </div>
  )
}
