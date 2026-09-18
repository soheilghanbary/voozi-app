import type { TaskPriority } from './utils/task-priority'

export type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  completedAt: string | null
  createdAt: string
  updatedAt: string
}
