import 'server-only'

import { ORPCError } from '@orpc/server'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/server/db'
import { note } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'
import type { Note } from '../types'
import { NOTE_COLORS } from '../utils/note-colors'

const noteOutput = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  color: z.enum(NOTE_COLORS),
  createdAt: z.string(),
  updatedAt: z.string(),
})

type NoteRow = typeof note.$inferSelect

function mapNote(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content ?? '',
    color: row.color,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const listNotes = authed
  .input(z.void())
  .output(z.array(noteOutput))
  .handler(async ({ context }) => {
    const rows = await db
      .select()
      .from(note)
      .where(eq(note.userId, context.userId))
      .orderBy(desc(note.updatedAt))

    return rows.map(mapNote)
  })

export const getNote = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(noteOutput)
  .handler(async ({ input, context }) => {
    const [row] = await db
      .select()
      .from(note)
      .where(and(eq(note.id, input.id), eq(note.userId, context.userId)))
      .limit(1)

    if (!row) {
      throw new ORPCError('NOT_FOUND', {
        message: 'یادداشت یافت نشد.',
      })
    }

    return mapNote(row)
  })
