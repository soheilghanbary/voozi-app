import 'server-only'

import { ORPCError } from '@orpc/server'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/server/db'
import { customer } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'
import type { Customer } from '../types'

const customerOutput = z.object({
  id: z.string(),
  name: z.string(),
  customerType: z.enum(['individual', 'corporate']),
  mobile: z.string(),
  phone: z.string(),
  address: z.string(),
  nationalId: z.string(),
  createdAt: z.string(),
})

type CustomerRow = typeof customer.$inferSelect

function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    customerType: row.customerType,
    mobile: row.mobile ?? '',
    phone: row.phone ?? '',
    address: row.address ?? '',
    nationalId: row.nationalId ?? '',
    createdAt: row.createdAt.toISOString(),
  }
}

export const listCustomers = authed
  .input(z.void())
  .output(z.array(customerOutput))
  .handler(async ({ context }) => {
    const rows = await db
      .select()
      .from(customer)
      .where(eq(customer.userId, context.userId))
      .orderBy(desc(customer.createdAt))

    return rows.map(mapCustomer)
  })

export const getCustomer = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(customerOutput)
  .handler(async ({ input, context }) => {
    const [row] = await db
      .select()
      .from(customer)
      .where(
        and(eq(customer.id, input.id), eq(customer.userId, context.userId))
      )
      .limit(1)

    if (!row) {
      throw new ORPCError('NOT_FOUND', {
        message: 'مشتری یافت نشد.',
      })
    }

    return mapCustomer(row)
  })
