'use client'

import { ORPCError } from '@orpc/client'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { api } from '@/server/orpc/client'
import type { Note } from '../types'
import type { NoteFormValues } from '../utils/note-schema'
import { NoteFormDialog } from './note-form-dialog'
import { NotesGrid } from './notes-grid'

function replaceById(notes: Note[], id: string, next: Note): Note[] {
  return notes.map((note) => (note.id === id ? next : note))
}

function restoreAt(notes: Note[], snapshot: Note, index: number): Note[] {
  if (notes.some((note) => note.id === snapshot.id)) {
    return replaceById(notes, snapshot.id, snapshot)
  }
  const restored = [...notes]
  restored.splice(Math.min(index, restored.length), 0, snapshot)
  return restored
}

export function NotesPageClient({ notes: initialNotes }: { notes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes)
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(
    () => new Set()
  )

  const notesRef = useRef(notes)
  useEffect(() => {
    notesRef.current = notes
  }, [notes])

  const flagPending = (id: string) =>
    setPendingIds((current) => new Set(current).add(id))

  const unflagPending = (id: string) =>
    setPendingIds((current) => {
      if (!current.has(id)) return current
      const next = new Set(current)
      next.delete(id)
      return next
    })

  async function handleCreate(values: NoteFormValues) {
    const tempId = crypto.randomUUID()
    const now = new Date().toISOString()
    const optimistic: Note = {
      id: tempId,
      title: values.title,
      content: values.content ?? '',
      color: values.color,
      createdAt: now,
      updatedAt: now,
    }
    flagPending(tempId)
    setNotes((current) => [optimistic, ...current])
    try {
      const { id } = await api.notes.create(values)
      setNotes((current) =>
        current.map((note) => (note.id === tempId ? { ...note, id } : note))
      )
      unflagPending(tempId)
      toast.success('یادداشت جدید با موفقیت ثبت شد.')
    } catch {
      setNotes((current) => current.filter((note) => note.id !== tempId))
      unflagPending(tempId)
      toast.error('ثبت یادداشت ناموفق بود. دوباره تلاش کنید.')
    }
  }

  async function handleUpdate(id: string, values: NoteFormValues) {
    if (pendingIds.has(id)) return
    const latest = notesRef.current
    const index = latest.findIndex((note) => note.id === id)
    const snapshot = latest[index]
    if (!snapshot) return

    const optimistic: Note = {
      ...snapshot,
      title: values.title,
      content: values.content ?? '',
      color: values.color,
      updatedAt: new Date().toISOString(),
    }
    flagPending(id)
    setNotes((current) => [
      optimistic,
      ...current.filter((note) => note.id !== id),
    ])
    try {
      await api.notes.update({ id, ...values })
      toast.success('یادداشت با موفقیت ویرایش شد.')
    } catch {
      setNotes((current) => restoreAt(current, snapshot, index))
      toast.error('ویرایش یادداشت ناموفق بود. دوباره تلاش کنید.')
    } finally {
      unflagPending(id)
    }
  }

  async function handleDelete(id: string) {
    if (pendingIds.has(id)) return
    const latest = notesRef.current
    const index = latest.findIndex((note) => note.id === id)
    const snapshot = latest[index]
    if (!snapshot) return

    flagPending(id)
    setNotes((current) => current.filter((note) => note.id !== id))
    try {
      await api.notes.delete({ id })
      toast.success('یادداشت با موفقیت حذف شد.')
    } catch (error) {
      setNotes((current) => restoreAt(current, snapshot, index))
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این یادداشت یافت نشد.')
      } else {
        toast.error('حذف یادداشت ناموفق بود. دوباره تلاش کنید.')
      }
    } finally {
      unflagPending(id)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="یادداشت‌ها">
        <NoteFormDialog
          onSubmit={handleCreate}
          trigger={
            <Button>
              <Plus />
              یادداشت جدید
            </Button>
          }
        />
      </PageHeader>
      <NotesGrid
        notes={notes}
        pendingIds={pendingIds}
        onCreate={handleCreate}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
