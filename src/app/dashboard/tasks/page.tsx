import { call } from '@orpc/server'
import { Suspense } from 'react'
import { listTasks } from '@/features/task/api/queries'
import { TasksPageClient } from '@/features/task/components/tasks-page'

export default function Page() {
  return (
    <Suspense fallback={<TasksSkeleton />}>
      <TasksSection />
    </Suspense>
  )
}

async function TasksSection() {
  const tasks = await call(listTasks)
  return <TasksPageClient tasks={tasks} />
}

function TasksSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex w-fit items-center gap-1 rounded-xl bg-muted p-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-8 w-20 animate-pulse rounded-lg bg-muted/60"
          />
        ))}
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3.5 rounded-2xl border p-4"
          >
            <div className="mt-0.5 size-5 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-muted/60" />
              <div className="flex items-center gap-2">
                <div className="h-5 w-14 animate-pulse rounded-full bg-muted/60" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted/60" />
              </div>
            </div>
            <div className="size-4 shrink-0 animate-pulse rounded bg-muted/60" />
          </div>
        ))}
      </div>
    </div>
  )
}
