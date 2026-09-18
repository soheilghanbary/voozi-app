'use client'

import { type ReactElement, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Note } from '../types'
import { NoteForm } from './note-form'

type NoteFormDialogProps = {
  note?: Note
  trigger?: ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NoteFormDialog({
  note,
  trigger,
  open,
  onOpenChange,
}: NoteFormDialogProps) {
  const [openState, setOpenState] = useState(false)
  const isControlled = open !== undefined

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setOpenState(next)
    onOpenChange?.(next)
  }

  return (
    <Dialog
      open={isControlled ? open : openState}
      onOpenChange={handleOpenChange}
    >
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{note ? 'ویرایش یادداشت' : 'یادداشت جدید'}</DialogTitle>
          <DialogDescription>
            {note
              ? `ویرایش «${note.title}» و ذخیره تغییرات.`
              : 'یادداشت جدید را ثبت کنید.'}
          </DialogDescription>
        </DialogHeader>
        <NoteForm
          key={note?.id ?? 'new'}
          note={note}
          onSaved={() => handleOpenChange(false)}
          onCancelled={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
