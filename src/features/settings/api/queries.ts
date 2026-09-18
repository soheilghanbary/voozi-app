import 'server-only'

import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/server/db'
import { businessProfile } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'
import type { BusinessProfile } from '../types'

const output = z.object({
  name: z.string().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  signature: z.string().nullable(),
  currency: z.enum(['rial', 'toman']),
})

export const getBusinessProfile = authed
  .input(z.void())
  .output(output)
  .handler(async ({ context }): Promise<BusinessProfile> => {
    const [row] = await db
      .select()
      .from(businessProfile)
      .where(eq(businessProfile.userId, context.userId))
      .limit(1)

    if (!row) {
      return {
        name: null,
        title: null,
        description: null,
        logo: null,
        signature: null,
        currency: 'toman',
      }
    }

    return {
      name: row.name,
      title: row.title,
      description: row.description,
      logo: row.logo,
      signature: row.signature,
      currency: row.currency,
    }
  })
