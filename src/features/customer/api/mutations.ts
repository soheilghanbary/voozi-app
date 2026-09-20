import 'server-only'

import { randomUUID } from 'node:crypto'
import { ORPCError } from '@orpc/server'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { customerFormSchema } from '@/features/customer/utils/customer-schema'
import { db } from '@/server/db'
import { customer } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'

const idOutput = z.object({ id: z.string() })

const customerIdSchema = customerFormSchema.extend({
  id: z.string().min(1),
})

const toNullable = (value: string) => {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

const revalidateCustomers = (userId: string) => {
  revalidateTag(`customers:${userId}`, { expire: 0 })
}

export const createCustomer = authed
  .input(customerFormSchema)
  .output(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    const [created] = await db
      .insert(customer)
      .values({
        id: randomUUID(),
        userId: context.userId,
        name: input.name,
        customerType: input.customerType,
        mobile: input.mobile,
        phone: toNullable(input.phone),
        address: toNullable(input.address),
      })
      .returning({ id: customer.id })

    revalidateCustomers(context.userId)

    return { id: created.id }
  })

export const updateCustomer = authed
  .input(customerIdSchema)
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [owned] = await db
      .select({ id: customer.id })
      .from(customer)
      .where(
        and(eq(customer.id, input.id), eq(customer.userId, context.userId))
      )
      .limit(1)

    if (!owned) {
      throw new ORPCError('NOT_FOUND', {
        message: 'مشتری یافت نشد.',
      })
    }

    const [updated] = await db
      .update(customer)
      .set({
        name: input.name,
        customerType: input.customerType,
        mobile: input.mobile,
        phone: toNullable(input.phone),
        address: toNullable(input.address),
      })
      .where(
        and(eq(customer.id, input.id), eq(customer.userId, context.userId))
      )
      .returning({ id: customer.id })

    revalidateCustomers(context.userId)

    return { id: updated.id }
  })

export const deleteCustomer = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const [deleted] = await db
      .delete(customer)
      .where(
        and(eq(customer.id, input.id), eq(customer.userId, context.userId))
      )
      .returning({ id: customer.id })

    if (!deleted) {
      throw new ORPCError('NOT_FOUND', {
        message: 'مشتری یافت نشد.',
      })
    }

    revalidateCustomers(context.userId)

    return { id: deleted.id }
  })
