import 'server-only'

import { randomUUID } from 'node:crypto'
import { ORPCError } from '@orpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { taskFormSchema } from '@/features/task/utils/task-schema'
import { db } from '@/server/db'
import { task } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'

const idOutput = z.object({ id: z.string() })

const taskIdSchema = taskFormSchema.extend({
  id: z.string().min(1),
})

const ownedFilter = (id: string, userId: string) =>
  and(eq(task.id, id), eq(task.userId, userId))

export const createTask = authed
  .input(taskFormSchema)
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [created] = await db
      .insert(task)
      .values({
        id: randomUUID(),
        userId: context.userId,
        title: input.title,
        description: input.description,
        priority: input.priority,
      })
      .returning({ id: task.id })

    return { id: created.id }
  })

export const updateTask = authed
  .input(taskIdSchema)
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [owned] = await db
      .select({ id: task.id })
      .from(task)
      .where(ownedFilter(input.id, context.userId))
      .limit(1)

    if (!owned) {
      throw new ORPCError('NOT_FOUND', { message: 'وظیفه یافت نشد.' })
    }

    const [updated] = await db
      .update(task)
      .set({
        title: input.title,
        description: input.description,
        priority: input.priority,
      })
      .where(ownedFilter(input.id, context.userId))
      .returning({ id: task.id })

    return { id: updated.id }
  })

export const setTaskCompleted = authed
  .input(
    z.object({
      id: z.string().min(1),
      completed: z.boolean(),
    })
  )
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [updated] = await db
      .update(task)
      .set({
        completedAt: input.completed ? new Date() : null,
      })
      .where(ownedFilter(input.id, context.userId))
      .returning({ id: task.id })

    if (!updated) {
      throw new ORPCError('NOT_FOUND', { message: 'وظیفه یافت نشد.' })
    }

    return { id: updated.id }
  })

export const deleteTask = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [deleted] = await db
      .delete(task)
      .where(ownedFilter(input.id, context.userId))
      .returning({ id: task.id })

    if (!deleted) {
      throw new ORPCError('NOT_FOUND', { message: 'وظیفه یافت نشد.' })
    }

    return { id: deleted.id }
  })
