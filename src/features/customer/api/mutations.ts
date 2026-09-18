import 'server-only'

import { randomUUID } from 'node:crypto'
import { ORPCError } from '@orpc/server'
import { and, eq, ne } from 'drizzle-orm'
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

export const createCustomer = authed
  .input(customerFormSchema)
  .output(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, context }) => {
    if (input.nationalId) {
      const [existing] = await db
        .select({ id: customer.id })
        .from(customer)
        .where(eq(customer.nationalId, input.nationalId))
        .limit(1)

      if (existing) {
        throw new ORPCError('CONFLICT', {
          message: 'این شناسه ملی یا کد ملی قبلاً ثبت شده است.',
        })
      }
    }

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
        nationalId: toNullable(input.nationalId),
      })
      .returning({ id: customer.id })

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

    const duplicate = input.nationalId
      ? await db
          .select({ id: customer.id })
          .from(customer)
          .where(
            and(
              eq(customer.nationalId, input.nationalId),
              ne(customer.id, input.id)
            )
          )
          .limit(1)
      : null

    if (duplicate) {
      throw new ORPCError('CONFLICT', {
        message: 'این شناسه ملی یا کد ملی قبلاً ثبت شده است.',
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
        nationalId: toNullable(input.nationalId),
      })
      .where(
        and(eq(customer.id, input.id), eq(customer.userId, context.userId))
      )
      .returning({ id: customer.id })

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

    return { id: deleted.id }
  })
