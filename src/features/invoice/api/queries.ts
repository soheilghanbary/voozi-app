import 'server-only'

import { ORPCError } from '@orpc/server'
import { and, desc, eq, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/server/db'
import { customer, invoice, invoiceItem } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'
import {
  INVOICE_TYPE,
  type Invoice,
  type InvoiceItem,
  type InvoiceType,
} from '../types'

const typeKeys = Object.keys(INVOICE_TYPE) as [InvoiceType, ...InvoiceType[]]

const invoiceOutput = z.object({
  id: z.string(),
  number: z.number(),
  type: z.enum(typeKeys),
  customerId: z.string().nullable(),
  customerName: z.string().nullable(),
  issueDate: z.string(),
  dueDate: z.string().nullable(),
  discount: z.number(),
  taxRate: z.number(),
  note: z.string(),
  signature: z.boolean(),
  total: z.number(),
  createdAt: z.string(),
})

const invoiceItemOutput = z.object({
  id: z.string(),
  productId: z.string().nullable(),
  name: z.string(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  discount: z.number(),
})

const invoiceDetailOutput = invoiceOutput.extend({
  items: z.array(invoiceItemOutput),
})

type InvoiceRow = typeof invoice.$inferSelect

const lineNet = (quantity: string, unitPrice: number, discount: number) =>
  Math.max(0, Number(quantity) * unitPrice - discount)

function computeTotal(subtotal: number, discount: number, taxRate: number) {
  const afterDiscount = Math.max(0, subtotal - discount)
  const tax = Math.round((afterDiscount * taxRate) / 100)
  return afterDiscount + tax
}

function mapInvoice(
  row: InvoiceRow,
  subtotal: number,
  customerName: string | null
): Invoice {
  return {
    id: row.id,
    number: row.number,
    type: row.type,
    customerId: row.customerId,
    customerName,
    issueDate: row.issueDate.toISOString(),
    dueDate: row.dueDate ? row.dueDate.toISOString() : null,
    discount: row.discount,
    taxRate: row.taxRate,
    note: row.note ?? '',
    signature: row.signature,
    total: computeTotal(subtotal, row.discount, row.taxRate),
    createdAt: row.createdAt.toISOString(),
  }
}

export const listInvoices = authed
  .input(z.void())
  .output(z.array(invoiceOutput))
  .handler(async ({ context }) => {
    const rows = await db
      .select()
      .from(invoice)
      .where(eq(invoice.userId, context.userId))
      .orderBy(desc(invoice.number))

    const invoiceIds = rows.map((row) => row.id)
    const customerIds = [
      ...new Set(
        rows.map((row) => row.customerId).filter((id): id is string => !!id)
      ),
    ]

    const [itemTotals, customers] = await Promise.all([
      invoiceIds.length
        ? db
            .select({
              invoiceId: invoiceItem.invoiceId,
              subtotal: sql<number>`sum(greatest(${invoiceItem.quantity} * ${invoiceItem.unitPrice} - ${invoiceItem.discount}, 0))`,
            })
            .from(invoiceItem)
            .where(inArray(invoiceItem.invoiceId, invoiceIds))
            .groupBy(invoiceItem.invoiceId)
        : Promise.resolve([] as { invoiceId: string; subtotal: number }[]),
      customerIds.length
        ? db
            .select({ id: customer.id, name: customer.name })
            .from(customer)
            .where(inArray(customer.id, customerIds))
        : Promise.resolve([] as { id: string; name: string }[]),
    ])

    const subtotalByInvoice = new Map(
      itemTotals.map((total) => [total.invoiceId, Number(total.subtotal)])
    )

    const customerNames = new Map(customers.map((c) => [c.id, c.name]))

    return rows.map((row) =>
      mapInvoice(
        row,
        subtotalByInvoice.get(row.id) ?? 0,
        row.customerId ? (customerNames.get(row.customerId) ?? null) : null
      )
    )
  })

export const getInvoice = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(invoiceDetailOutput)
  .handler(async ({ input, context }) => {
    const [joined] = await db
      .select({ row: invoice, customerName: customer.name })
      .from(invoice)
      .leftJoin(customer, eq(invoice.customerId, customer.id))
      .where(and(eq(invoice.id, input.id), eq(invoice.userId, context.userId)))
      .limit(1)

    if (!joined?.row) {
      throw new ORPCError('NOT_FOUND', {
        message: 'فاکتور یافت نشد.',
      })
    }

    const row = joined.row

    const itemRows = await db
      .select()
      .from(invoiceItem)
      .where(eq(invoiceItem.invoiceId, row.id))

    const items: InvoiceItem[] = itemRows.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      unit: item.unit,
      quantity: Number(item.quantity),
      unitPrice: item.unitPrice,
      discount: item.discount,
    }))

    const subtotal = itemRows.reduce(
      (sum, item) =>
        sum + lineNet(item.quantity, item.unitPrice, item.discount),
      0
    )

    return {
      ...mapInvoice(row, subtotal, joined.customerName ?? null),
      items,
    }
  })
