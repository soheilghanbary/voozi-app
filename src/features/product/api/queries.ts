import 'server-only'

import { ORPCError } from '@orpc/server'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/server/db'
import { product } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'
import {
  PRODUCT_TYPE,
  PRODUCT_UNITS,
  type Product,
  type ProductType,
  type ProductUnit,
} from '../types'

const productTypeKeys = Object.keys(PRODUCT_TYPE) as [
  ProductType,
  ...ProductType[],
]
const productUnitKeys = Object.keys(PRODUCT_UNITS) as [
  ProductUnit,
  ...ProductUnit[],
]

const productOutput = z.object({
  id: z.string(),
  name: z.string(),
  productType: z.enum(productTypeKeys),
  unit: z.enum(productUnitKeys),
  basePrice: z.number(),
  description: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
})

type ProductRow = typeof product.$inferSelect

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    productType: row.productType,
    unit: row.unit as ProductUnit,
    basePrice: row.basePrice,
    description: row.description ?? '',
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
  }
}

export const listProducts = authed
  .input(z.void())
  .output(z.array(productOutput))
  .handler(async ({ context }) => {
    const rows = await db
      .select()
      .from(product)
      .where(eq(product.userId, context.userId))
      .orderBy(desc(product.createdAt))

    return rows.map(mapProduct)
  })

export const getProduct = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(productOutput)
  .handler(async ({ input, context }) => {
    const [row] = await db
      .select()
      .from(product)
      .where(and(eq(product.id, input.id), eq(product.userId, context.userId)))
      .limit(1)

    if (!row) {
      throw new ORPCError('NOT_FOUND', {
        message: 'محصول یافت نشد.',
      })
    }

    return mapProduct(row)
  })
