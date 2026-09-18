import 'server-only'

import { ORPCError } from '@orpc/server'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/server/db'
import { task } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'
import type { Task } from '../types'
import { PRIORITIES } from '../utils/task-priority'

const taskOutput = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(PRIORITIES),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

type TaskRow = typeof task.$inferSelect

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    priority: row.priority,
    completedAt: row.completedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const listTasks = authed
  .input(z.void())
  .output(z.array(taskOutput))
  .handler(async ({ context }) => {
    const rows = await db
      .select()
      .from(task)
      .where(eq(task.userId, context.userId))
      .orderBy(desc(task.updatedAt))

    return rows.map(mapTask)
  })

export const getTask = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(taskOutput)
  .handler(async ({ input, context }) => {
    const [row] = await db
      .select()
      .from(task)
      .where(and(eq(task.id, input.id), eq(task.userId, context.userId)))
      .limit(1)

    if (!row) {
      throw new ORPCError('NOT_FOUND', {
        message: 'وظیفه یافت نشد.',
      })
    }

    return mapTask(row)
  })
