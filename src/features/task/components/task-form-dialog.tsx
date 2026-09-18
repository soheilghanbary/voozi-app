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
import type { Task } from '../types'
import type { TaskFormValues } from '../utils/task-schema'
import { TaskForm } from './task-form'

type TaskFormDialogProps = {
  task?: Task
  trigger?: ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (values: TaskFormValues) => void
}

export function TaskFormDialog({
  task,
  trigger,
  open,
  onOpenChange,
  onSubmit,
}: TaskFormDialogProps) {
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
          <DialogTitle>{task ? 'ویرایش وظیفه' : 'وظیفه جدید'}</DialogTitle>
          <DialogDescription>
            {task
              ? `ویرایش «${task.title}» و ذخیره تغییرات.`
              : 'وظیفه جدید را ثبت کنید.'}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          key={task?.id ?? 'new'}
          task={task}
          onSubmit={onSubmit}
          onSaved={() => handleOpenChange(false)}
          onCancelled={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
