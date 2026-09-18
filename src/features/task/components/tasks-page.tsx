'use client'

import { ORPCError } from '@orpc/client'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { api } from '@/server/orpc/client'
import type { Task } from '../types'
import type { TaskFormValues } from '../utils/task-schema'
import { TaskFormDialog } from './task-form-dialog'
import { TasksList } from './tasks-list'

type TaskFilter = 'all' | 'open' | 'done'

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'همه' },
  { key: 'open', label: 'باز' },
  { key: 'done', label: 'تکمیل‌شده' },
]

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aDone = !!a.completedAt
    const bDone = !!b.completedAt
    if (aDone !== bDone) return aDone ? 1 : -1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

export function TasksPageClient({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')

  const counts = useMemo(
    () => ({
      all: tasks.length,
      open: tasks.filter((task) => !task.completedAt).length,
      done: tasks.filter((task) => !!task.completedAt).length,
    }),
    [tasks]
  )

  const visibleTasks = useMemo(() => {
    if (filter === 'open') {
      return sortTasks(tasks.filter((task) => !task.completedAt))
    }
    if (filter === 'done') {
      return sortTasks(tasks.filter((task) => !!task.completedAt))
    }
    return sortTasks(tasks)
  }, [tasks, filter])

  async function handleCreate(values: TaskFormValues) {
    const tempId = crypto.randomUUID()
    const now = new Date().toISOString()
    const optimistic: Task = {
      id: tempId,
      title: values.title,
      description: values.description ?? '',
      priority: values.priority,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    }
    setTasks((current) => sortTasks([optimistic, ...current]))
    try {
      const { id } = await api.tasks.create(values)
      setTasks((current) =>
        current.map((task) => (task.id === tempId ? { ...task, id } : task))
      )
      toast.success('وظیفه جدید با موفقیت ثبت شد.')
    } catch {
      setTasks((current) => current.filter((task) => task.id !== tempId))
      toast.error('ثبت وظیفه ناموفق بود. دوباره تلاش کنید.')
    }
  }

  async function handleUpdate(id: string, values: TaskFormValues) {
    const index = tasks.findIndex((task) => task.id === id)
    const snapshot = tasks[index]
    if (!snapshot) return

    const optimistic: Task = {
      ...snapshot,
      title: values.title,
      description: values.description ?? '',
      priority: values.priority,
      updatedAt: new Date().toISOString(),
    }
    setTasks((current) =>
      sortTasks(current.map((task) => (task.id === id ? optimistic : task)))
    )
    try {
      await api.tasks.update({ id, ...values })
      toast.success('وظیفه با موفقیت ویرایش شد.')
    } catch {
      setTasks((current) => {
        const without = current.filter((task) => task.id !== id)
        without.splice(index, 0, snapshot)
        return without
      })
      toast.error('ویرایش وظیفه ناموفق بود. دوباره تلاش کنید.')
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    const index = tasks.findIndex((task) => task.id === id)
    const snapshot = tasks[index]
    if (!snapshot) return

    const optimistic: Task = {
      ...snapshot,
      completedAt: completed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    }
    setTasks((current) =>
      sortTasks(current.map((task) => (task.id === id ? optimistic : task)))
    )
    try {
      await api.tasks.setCompleted({ id, completed })
    } catch {
      setTasks((current) => {
        const without = current.filter((task) => task.id !== id)
        without.splice(index, 0, snapshot)
        return without
      })
      toast.error('تغییر وضعیت وظیفه ناموفق بود. دوباره تلاش کنید.')
    }
  }

  async function handleDelete(id: string) {
    const index = tasks.findIndex((task) => task.id === id)
    const snapshot = tasks[index]
    if (!snapshot) return

    setTasks((current) => current.filter((task) => task.id !== id))
    try {
      await api.tasks.delete({ id })
      toast.success('وظیفه با موفقیت حذف شد.')
    } catch (error) {
      setTasks((current) => {
        if (current.some((task) => task.id === id)) return current
        const restored = [...current]
        restored.splice(index, 0, snapshot)
        return restored
      })
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این وظیفه یافت نشد.')
      } else {
        toast.error('حذف وظیفه ناموفق بود. دوباره تلاش کنید.')
      }
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="وظایف">
        <TaskFormDialog
          onSubmit={handleCreate}
          trigger={
            <Button>
              <Plus />
              وظیفه جدید
            </Button>
          }
        />
      </PageHeader>

      <div className="flex w-fit items-center gap-1 rounded-xl bg-muted p-1">
        {FILTERS.map(({ key, label }) => {
          const selected = filter === key
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(key)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-medium text-sm',
                'transition-all duration-150 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                selected
                  ? 'bg-card shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[11px] tabular-nums leading-none',
                  selected
                    ? 'bg-muted'
                    : 'bg-background/70 text-muted-foreground'
                )}
              >
                {counts[key]}
              </span>
            </button>
          )
        })}
      </div>

      {tasks.length > 0 && visibleTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground text-sm">
          {filter === 'open'
            ? 'وظیفه‌ای در انتظار انجام نیست. آفرین!'
            : 'وظیفه‌ای در این دسته وجود ندارد.'}
        </div>
      ) : (
        <TasksList
          tasks={visibleTasks}
          onCreate={handleCreate}
          onEdit={handleUpdate}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}
    </div>
  )
}
