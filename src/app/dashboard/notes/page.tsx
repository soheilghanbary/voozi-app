import { call } from '@orpc/server'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { listNotes } from '@/features/note/api/queries'
import { NotesPageClient } from '@/features/note/components/notes-page'

export default function Page() {
  return (
    <Suspense fallback={<NotesGridSkeleton />}>
      <NotesSection />
    </Suspense>
  )
}

async function NotesSection() {
  const notes = await call(listNotes)
  return <NotesPageClient notes={notes} />
}

function NotesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl p-5 ring-1 ring-border"
        >
          <Skeleton className="h-4 w-2/3" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-3" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
          <Skeleton className="h-3 w-1/3 pt-1" />
        </div>
      ))}
    </div>
  )
}
