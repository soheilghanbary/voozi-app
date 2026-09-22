import 'server-only'

import { z } from 'zod'
import { db } from '@/server/db'
import { businessProfile } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'
import { businessProfileFormSchema } from '../utils/settings-schema'

export const updateBusinessProfile = authed
  .input(businessProfileFormSchema)
  .output(z.object({ ok: z.boolean() }))
  .handler(async ({ input, context }) => {
    const set: Partial<typeof businessProfile.$inferInsert> = {}
    if (input.name !== undefined) set.name = input.name
    if (input.title !== undefined) set.title = input.title
    if (input.description !== undefined) set.description = input.description
    if (input.logo !== undefined) set.logo = input.logo
    if (input.signature !== undefined) set.signature = input.signature
    if (input.phone !== undefined) set.phone = input.phone
    if (input.tel !== undefined) set.tel = input.tel
    if (input.website !== undefined) set.website = input.website
    if (input.currency !== undefined) set.currency = input.currency
    if (input.invoiceColor !== undefined) set.invoiceColor = input.invoiceColor

    await db
      .insert(businessProfile)
      .values({ userId: context.userId, ...set })
      .onConflictDoUpdate({
        target: businessProfile.userId,
        set,
      })

    return { ok: true }
  })
