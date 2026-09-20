import 'server-only'

import { randomUUID } from 'node:crypto'
import { ORPCError } from '@orpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { productFormSchema } from '@/features/product/utils/product-schema'
import { db } from '@/server/db'
import { product } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'

const idOutput = z.object({ id: z.string() })

const productIdSchema = productFormSchema.extend({
  id: z.string().min(1),
})

export const createProduct = authed
  .input(productFormSchema)
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [created] = await db
      .insert(product)
      .values({
        id: randomUUID(),
        userId: context.userId,
        name: input.name,
        productType: input.productType,
        unit: input.unit,
        basePrice: input.basePrice,
      })
      .returning({ id: product.id })

    return { id: created.id }
  })

export const updateProduct = authed
  .input(productIdSchema)
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [owned] = await db
      .select({ id: product.id })
      .from(product)
      .where(and(eq(product.id, input.id), eq(product.userId, context.userId)))
      .limit(1)

    if (!owned) {
      throw new ORPCError('NOT_FOUND', {
        message: 'محصول یافت نشد.',
      })
    }

    const [updated] = await db
      .update(product)
      .set({
        name: input.name,
        productType: input.productType,
        unit: input.unit,
        basePrice: input.basePrice,
      })
      .where(and(eq(product.id, input.id), eq(product.userId, context.userId)))
      .returning({ id: product.id })

    return { id: updated.id }
  })

export const deleteProduct = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(idOutput)
  .handler(async ({ input, context }) => {
    const [deleted] = await db
      .delete(product)
      .where(and(eq(product.id, input.id), eq(product.userId, context.userId)))
      .returning({ id: product.id })

    if (!deleted) {
      throw new ORPCError('NOT_FOUND', {
        message: 'محصول یافت نشد.',
      })
    }

    return { id: deleted.id }
  })
