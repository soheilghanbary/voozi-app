import { call } from '@orpc/server'
import { Suspense } from 'react'
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
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="space-y-2 pt-1">
            <div className="h-3 animate-pulse rounded bg-muted/60" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted/60" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-muted/60" />
          </div>
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted/60 pt-1" />
        </div>
      ))}
    </div>
  )
}
