'use client'

import {
  Check,
  CircleCheck,
  EllipsisVertical,
  ListTodo,
  Loader2,
  Pencil,
  RotateCcw,
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
import type { Task } from '../types'
import { dateFormatter } from '../utils/format'
import {
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  type TaskPriority,
} from '../utils/task-priority'
import type { TaskFormValues } from '../utils/task-schema'
import { TaskFormDialog } from './task-form-dialog'

function TaskCheckbox({
  completed,
  priority,
  pending,
  disabled,
  onToggle,
}: {
  completed: boolean
  priority: TaskPriority
  pending?: boolean
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={completed}
      aria-label={completed ? 'بازگردانی وظیفه' : 'تکمیل وظیفه'}
      aria-busy={pending}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        completed
          ? PRIORITY_STYLES[priority].toggle
          : 'border-input hover:border-foreground/40',
        disabled && 'pointer-events-none opacity-50'
      )}
    >
      <Check
        strokeWidth={3.5}
        className={cn(
          'size-3 transition-transform duration-200',
          completed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        )}
      />
    </button>
  )
}

function TaskRow({
  task,
  pending,
  onEdit,
  onDelete,
  onToggle,
}: {
  task: Task
  pending: boolean
  onEdit: (id: string, values: TaskFormValues) => void
  onDelete: (id: string) => void
  onToggle: (id: string, completed: boolean) => void
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const completed = !!task.completedAt

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3.5 rounded-2xl border bg-card p-4',
        'transition-all duration-200',
        completed ? 'opacity-60' : 'hover:shadow-sm'
      )}
    >
      <TaskCheckbox
        completed={completed}
        priority={task.priority}
        pending={pending}
        disabled={pending}
        onToggle={() => onToggle(task.id, !completed)}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'font-semibold text-sm leading-6',
              completed && 'text-muted-foreground line-through'
            )}
          >
            {task.title}
          </p>
          {pending && (
            <Loader2
              className="size-3.5 shrink-0 animate-spin text-muted-foreground"
              aria-label="در حال همگام‌سازی"
            />
          )}
        </div>
        {task.description && (
          <p
            className={cn(
              'mt-0.5 line-clamp-2 text-muted-foreground text-sm leading-6',
              completed && 'line-through'
            )}
          >
            {task.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ring-1 ring-inset',
              PRIORITY_STYLES[task.priority].badge
            )}
          >
            <span
              aria-hidden
              className={cn(
                'size-1.5 rounded-full',
                PRIORITY_STYLES[task.priority].dot
              )}
            />
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="text-muted-foreground tabular-nums">
            {completed ? 'تکمیل‌شده' : 'آخرین ویرایش'}{' '}
            {dateFormatter.format(new Date(task.completedAt ?? task.updatedAt))}
          </span>
        </div>
      </div>

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
          <EllipsisVertical />
          <span className="sr-only">عملیات وظیفه</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={pending}
            onClick={() => onToggle(task.id, !completed)}
          >
            {completed ? <RotateCcw /> : <CircleCheck />}
            {completed ? 'بازگردانی' : 'تکمیل'}
          </DropdownMenuItem>
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

      <TaskFormDialog
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={(values) => onEdit(task.id, values)}
      />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف وظیفه</DialogTitle>
            <DialogDescription>
              آیا از حذف «{task.title}» مطمئن هستید؟ این عملیات قابل بازگشت
              نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => {
                onDelete(task.id)
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

export function TasksList({
  tasks,
  pendingIds,
  onCreate,
  onEdit,
  onDelete,
  onToggle,
}: {
  tasks: Task[]
  pendingIds?: ReadonlySet<string>
  onCreate: (values: TaskFormValues) => void
  onEdit: (id: string, values: TaskFormValues) => void
  onDelete: (id: string) => void
  onToggle: (id: string, completed: boolean) => void
}) {
  const isPending = (id: string) => pendingIds?.has(id) ?? false

  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed p-14 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
          <ListTodo className="size-6" />
        </div>
        <h3 className="mt-4 font-bold text-lg">وظیفه‌ای ثبت نشده است</h3>
        <p className="mt-1 text-muted-foreground text-sm">
          اولین وظیفه خود را اضافه کنید.
        </p>
        <div className="mt-6 flex justify-center">
          <TaskFormDialog
            onSubmit={onCreate}
            trigger={
              <Button>
                <CircleCheck />
                وظیفه جدید
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          pending={isPending(task.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
