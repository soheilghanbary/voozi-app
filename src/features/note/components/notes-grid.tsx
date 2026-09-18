'use client'

import { ORPCError } from '@orpc/client'
import {
  EllipsisVertical,
  Pencil,
  Plus,
  StickyNote,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
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
import { api } from '@/server/orpc/client'
import type { Note } from '../types'
import { dateFormatter } from '../utils/format'
import { NOTE_COLOR_STYLES } from '../utils/note-colors'
import { NoteFormDialog } from './note-form-dialog'

function NoteCard({ note }: { note: Note }) {
  const router = useRouter()
  const accent = NOTE_COLOR_STYLES[note.color]
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await api.notes.delete({ id: note.id })
      toast.success('یادداشت با موفقیت حذف شد.')
      setDeleteOpen(false)
      router.refresh()
    } catch (error) {
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این یادداشت یافت نشد.')
      } else {
        toast.error('حذف یادداشت ناموفق بود. دوباره تلاش کنید.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border-s-2 p-5 ring-1 ring-border/60',
        'transition-all duration-300 ease-out',
        'shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
        'hover:-translate-y-0.5 hover:shadow-lg hover:ring-border',
        accent.wash,
        accent.edge,
        accent.hover
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
                className="-ms-1 -mt-1 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100"
              />
            }
          >
            <EllipsisVertical />
            <span className="sr-only">عملیات یادداشت</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil />
              ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
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

      <NoteFormDialog note={note} open={editOpen} onOpenChange={setEditOpen} />
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
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? 'در حال حذف…' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptyState() {
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

export function NotesGrid({ notes }: { notes: Note[] }) {
  if (!notes.length) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
