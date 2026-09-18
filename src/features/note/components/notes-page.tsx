'use client'

import { ORPCError } from '@orpc/client'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { api } from '@/server/orpc/client'
import type { Note } from '../types'
import type { NoteFormValues } from '../utils/note-schema'
import { NoteFormDialog } from './note-form-dialog'
import { NotesGrid } from './notes-grid'

export function NotesPageClient({ notes: initialNotes }: { notes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes)

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
    setNotes((current) => [optimistic, ...current])
    try {
      const { id } = await api.notes.create(values)
      setNotes((current) =>
        current.map((note) => (note.id === tempId ? { ...note, id } : note))
      )
      toast.success('یادداشت جدید با موفقیت ثبت شد.')
    } catch {
      setNotes((current) => current.filter((note) => note.id !== tempId))
      toast.error('ثبت یادداشت ناموفق بود. دوباره تلاش کنید.')
    }
  }

  async function handleUpdate(id: string, values: NoteFormValues) {
    const index = notes.findIndex((note) => note.id === id)
    const snapshot = notes[index]
    if (!snapshot) return

    const optimistic: Note = {
      ...snapshot,
      title: values.title,
      content: values.content ?? '',
      color: values.color,
      updatedAt: new Date().toISOString(),
    }
    setNotes((current) => [
      optimistic,
      ...current.filter((note) => note.id !== id),
    ])
    try {
      await api.notes.update({ id, ...values })
      toast.success('یادداشت با موفقیت ویرایش شد.')
    } catch {
      setNotes((current) => {
        const without = current.filter((note) => note.id !== id)
        without.splice(index, 0, snapshot)
        return without
      })
      toast.error('ویرایش یادداشت ناموفق بود. دوباره تلاش کنید.')
    }
  }

  async function handleDelete(id: string) {
    const index = notes.findIndex((note) => note.id === id)
    const snapshot = notes[index]
    if (!snapshot) return

    setNotes((current) => current.filter((note) => note.id !== id))
    try {
      await api.notes.delete({ id })
      toast.success('یادداشت با موفقیت حذف شد.')
    } catch (error) {
      setNotes((current) => {
        if (current.some((note) => note.id === id)) return current
        const restored = [...current]
        restored.splice(index, 0, snapshot)
        return restored
      })
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این یادداشت یافت نشد.')
      } else {
        toast.error('حذف یادداشت ناموفق بود. دوباره تلاش کنید.')
      }
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
        onCreate={handleCreate}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
