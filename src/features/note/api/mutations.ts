import 'server-only'

import { randomUUID } from 'node:crypto'
import { ORPCError } from '@orpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { noteFormSchema } from '@/features/note/utils/note-schema'
import { db } from '@/server/db'
import { note } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'

const idOutput = z.object({ id: z.string() })

const noteIdSchema = noteFormSchema.extend({
  id: z.string().min(1),
})

export const createNote = authed
  .input(noteFormSchema)
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [created] = await db
      .insert(note)
      .values({
        id: randomUUID(),
        userId: context.userId,
        title: input.title,
        content: input.content,
        color: input.color,
      })
      .returning({ id: note.id })

    return { id: created.id }
  })

export const updateNote = authed
  .input(noteIdSchema)
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [owned] = await db
      .select({ id: note.id })
      .from(note)
      .where(and(eq(note.id, input.id), eq(note.userId, context.userId)))
      .limit(1)

    if (!owned) {
      throw new ORPCError('NOT_FOUND', { message: 'یادداشت یافت نشد.' })
    }

    const [updated] = await db
      .update(note)
      .set({
        title: input.title,
        content: input.content,
        color: input.color,
      })
      .where(and(eq(note.id, input.id), eq(note.userId, context.userId)))
      .returning({ id: note.id })

    return { id: updated.id }
  })

export const deleteNote = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [deleted] = await db
      .delete(note)
      .where(and(eq(note.id, input.id), eq(note.userId, context.userId)))
      .returning({ id: note.id })

    if (!deleted) {
      throw new ORPCError('NOT_FOUND', { message: 'یادداشت یافت نشد.' })
    }

    return { id: deleted.id }
  })
