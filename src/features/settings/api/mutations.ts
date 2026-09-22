import 'server-only'

import { z } from 'zod'
import { db } from '@/server/db'
import { businessProfile } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'
import { businessProfileFormSchema } from '../utils/settings-schema'

function definedEntries<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  ) as Partial<T>
}

export const updateBusinessProfile = authed
  .input(businessProfileFormSchema)
  .output(z.object({ ok: z.boolean() }))
  .handler(async ({ input, context }) => {
    const set = definedEntries(input)

    await db
      .insert(businessProfile)
      .values({ userId: context.userId, ...set })
      .onConflictDoUpdate({
        target: businessProfile.userId,
        set,
      })

    return { ok: true }
  })
