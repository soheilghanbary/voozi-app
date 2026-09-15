import 'server-only'

import { randomUUID } from 'node:crypto'
import { ORPCError } from '@orpc/server'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { invoiceFormSchema } from '@/features/invoice/utils/invoice-schema'
import { db } from '@/server/db'
import { invoice, invoiceItem } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'

const idOutput = z.object({ id: z.string() })

const invoiceIdSchema = invoiceFormSchema.extend({
  id: z.string().min(1),
})

export const createInvoice = authed
  .input(invoiceFormSchema)
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [created] = await db.transaction(async (tx) => {
      const [last] = await tx
        .select({ number: invoice.number })
        .from(invoice)
        .where(eq(invoice.userId, context.userId))
        .orderBy(desc(invoice.number))
        .limit(1)

      const nextNumber = (last?.number ?? 0) + 1
      const invoiceId = randomUUID()

      const [inserted] = await tx
        .insert(invoice)
        .values({
          id: invoiceId,
          userId: context.userId,
          customerId: input.customerId,
          number: nextNumber,
          status: 'draft',
          discount: input.discount,
          taxRate: input.taxRate,
          note: input.note,
        })
        .returning({ id: invoice.id })

      await tx.insert(invoiceItem).values(
        input.items.map((item) => ({
          id: randomUUID(),
          invoiceId,
          productId: item.productId ?? null,
          name: item.name,
          unit: item.unit,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice,
          discount: item.discount,
        }))
      )

      return inserted
    })

    return { id: created.id }
  })

export const updateInvoice = authed
  .input(invoiceIdSchema)
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [owned] = await db
      .select({ id: invoice.id })
      .from(invoice)
      .where(and(eq(invoice.id, input.id), eq(invoice.userId, context.userId)))
      .limit(1)

    if (!owned) {
      throw new ORPCError('NOT_FOUND', {
        message: 'فاکتور یافت نشد.',
      })
    }

    await db.transaction(async (tx) => {
      await tx
        .update(invoice)
        .set({
          customerId: input.customerId,
          discount: input.discount,
          taxRate: input.taxRate,
          note: input.note,
        })
        .where(
          and(eq(invoice.id, input.id), eq(invoice.userId, context.userId))
        )

      await tx.delete(invoiceItem).where(eq(invoiceItem.invoiceId, input.id))

      await tx.insert(invoiceItem).values(
        input.items.map((item) => ({
          id: randomUUID(),
          invoiceId: input.id,
          productId: item.productId ?? null,
          name: item.name,
          unit: item.unit,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice,
          discount: item.discount,
        }))
      )
    })

    return { id: input.id }
  })

export const deleteInvoice = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [deleted] = await db
      .delete(invoice)
      .where(and(eq(invoice.id, input.id), eq(invoice.userId, context.userId)))
      .returning({ id: invoice.id })

    if (!deleted) {
      throw new ORPCError('NOT_FOUND', {
        message: 'فاکتور یافت نشد.',
      })
    }

    return { id: deleted.id }
  })
