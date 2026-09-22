import { call } from '@orpc/server'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
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
          <Skeleton key={index} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3.5 rounded-2xl border p-4"
          >
            <Skeleton className="mt-0.5 size-5 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-5/6" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="size-4 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
