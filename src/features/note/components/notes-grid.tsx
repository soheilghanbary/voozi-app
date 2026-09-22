'use client'

import {
  EllipsisVertical,
  Loader2,
  Pencil,
  Plus,
  StickyNote,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Note } from '../types'
import { dateFormatter } from '../utils/format'
import { NOTE_COLOR_STYLES } from '../utils/note-colors'
import type { NoteFormValues } from '../utils/note-schema'
import { NoteFormDialog } from './note-form-dialog'

type NotesGridProps = {
  notes: Note[]
  pendingIds?: ReadonlySet<string>
  onCreate: (values: NoteFormValues) => void
  onEdit: (id: string, values: NoteFormValues) => void
  onDelete: (id: string) => void
}

function NoteCard({
  note,
  pending,
  onEdit,
  onDelete,
}: {
  note: Note
  pending: boolean
  onEdit: (id: string, values: NoteFormValues) => void
  onDelete: (id: string) => void
}) {
  const accent = NOTE_COLOR_STYLES[note.color]
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border-s-2 p-5 ring-1 ring-border/60',
        'transition-all duration-300 ease-out',
        'shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
        'hover:-translate-y-0.5 hover:shadow-lg hover:ring-border',
        accent.wash,
        accent.edge,
        accent.hover,
        pending && 'pointer-events-none opacity-70'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 font-semibold text-base leading-7">
          {note.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={pending}
                className="-ms-1 -mt-1 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100"
              />
            }
          >
            {pending ? (
              <Loader2
                className="size-4 animate-spin"
                aria-label="در حال همگام‌سازی"
              />
            ) : (
              <EllipsisVertical />
            )}
            <span className="sr-only">عملیات یادداشت</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={pending}
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
              ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={pending}
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {note.content ? (
        <p className="mt-2 line-clamp-5 flex-1 whitespace-pre-line text-muted-foreground text-sm leading-7">
          {note.content}
        </p>
      ) : (
        <p className="mt-2 flex-1 text-muted-foreground/50 text-sm leading-7">
          بدون متن
        </p>
      )}

      <div className="mt-4 flex items-center gap-1.5 border-t pt-3 text-muted-foreground text-xs">
        <span className="tabular-nums">
          آخرین ویرایش {dateFormatter.format(new Date(note.updatedAt))}
        </span>
      </div>

      <NoteFormDialog
        note={note}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={(values) => onEdit(note.id, values)}
      />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف یادداشت</DialogTitle>
            <DialogDescription>
              آیا از حذف «{note.title}» مطمئن هستید؟ این عملیات قابل بازگشت
              نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(note.id)
                setDeleteOpen(false)
              }}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptyState({
  onCreate,
}: {
  onCreate: (values: NoteFormValues) => void
}) {
  return (
    <div className="rounded-2xl border border-dashed p-14 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
        <StickyNote className="size-6" />
      </div>
      <h3 className="mt-4 font-bold text-lg">هنوز یادداشتی ثبت نشده است</h3>
      <p className="mt-1 text-muted-foreground text-sm">
        اولین یادداشت خود را بنویسید.
      </p>
      <div className="mt-6 flex justify-center">
        <NoteFormDialog
          onSubmit={onCreate}
          trigger={
            <Button>
              <Plus />
              یادداشت جدید
            </Button>
          }
        />
      </div>
    </div>
  )
}

export function NotesGrid({
  notes,
  pendingIds,
  onCreate,
  onEdit,
  onDelete,
}: NotesGridProps) {
  const isPending = (id: string) => pendingIds?.has(id) ?? false

  if (!notes.length) {
    return <EmptyState onCreate={onCreate} />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          pending={isPending(note.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
