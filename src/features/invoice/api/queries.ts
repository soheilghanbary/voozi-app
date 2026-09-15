import 'server-only'

import { ORPCError } from '@orpc/server'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/server/db'
import { customer, invoice, invoiceItem } from '@/server/db/schema'
import { authed } from '@/server/orpc/context'
import {
  INVOICE_STATUS,
  type Invoice,
  type InvoiceItem,
  type InvoiceStatus,
} from '../types'

const statusKeys = Object.keys(INVOICE_STATUS) as [
  InvoiceStatus,
  ...InvoiceStatus[],
]

const invoiceOutput = z.object({
  id: z.string(),
  number: z.number(),
  customerId: z.string().nullable(),
  customerName: z.string().nullable(),
  status: z.enum(statusKeys),
  issueDate: z.string(),
  dueDate: z.string().nullable(),
  discount: z.number(),
  taxRate: z.number(),
  note: z.string(),
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
type InvoiceItemRow = typeof invoiceItem.$inferSelect

const lineNet = (quantity: string, unitPrice: number, discount: number) =>
  Math.max(0, Number(quantity) * unitPrice - discount)

function computeTotal(
  items: Pick<InvoiceItemRow, 'quantity' | 'unitPrice' | 'discount'>[],
  discount: number,
  taxRate: number
) {
  const subtotal = items.reduce(
    (sum, item) => sum + lineNet(item.quantity, item.unitPrice, item.discount),
    0
  )
  const afterDiscount = Math.max(0, subtotal - discount)
  const tax = Math.round((afterDiscount * taxRate) / 100)
  return afterDiscount + tax
}

function mapInvoice(
  row: InvoiceRow,
  items: Pick<InvoiceItemRow, 'quantity' | 'unitPrice' | 'discount'>[],
  customerNames: Map<string, string>
): Invoice {
  return {
    id: row.id,
    number: row.number,
    customerId: row.customerId,
    customerName: row.customerId
      ? (customerNames.get(row.customerId) ?? null)
      : null,
    status: row.status,
    issueDate: row.issueDate.toISOString(),
    dueDate: row.dueDate ? row.dueDate.toISOString() : null,
    discount: row.discount,
    taxRate: row.taxRate,
    note: row.note ?? '',
    total: computeTotal(items, row.discount, row.taxRate),
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

    const [items, customers] = await Promise.all([
      invoiceIds.length
        ? db
            .select()
            .from(invoiceItem)
            .where(inArray(invoiceItem.invoiceId, invoiceIds))
        : Promise.resolve([] as InvoiceItemRow[]),
      customerIds.length
        ? db
            .select({ id: customer.id, name: customer.name })
            .from(customer)
            .where(inArray(customer.id, customerIds))
        : Promise.resolve([] as { id: string; name: string }[]),
    ])

    const itemsByInvoice = new Map<string, InvoiceItemRow[]>()
    for (const item of items) {
      const list = itemsByInvoice.get(item.invoiceId) ?? []
      list.push(item)
      itemsByInvoice.set(item.invoiceId, list)
    }

    const customerNames = new Map(customers.map((c) => [c.id, c.name]))

    return rows.map((row) =>
      mapInvoice(row, itemsByInvoice.get(row.id) ?? [], customerNames)
    )
  })

export const getInvoice = authed
  .input(z.object({ id: z.string().min(1) }))
  .output(invoiceDetailOutput)
  .handler(async ({ input, context }) => {
    const [row] = await db
      .select()
      .from(invoice)
      .where(and(eq(invoice.id, input.id), eq(invoice.userId, context.userId)))
      .limit(1)

    if (!row) {
      throw new ORPCError('NOT_FOUND', {
        message: 'فاکتور یافت نشد.',
      })
    }

    const customerNames = new Map<string, string>()
    if (row.customerId) {
      const [customerRow] = await db
        .select({ id: customer.id, name: customer.name })
        .from(customer)
        .where(eq(customer.id, row.customerId))
        .limit(1)
      if (customerRow) {
        customerNames.set(customerRow.id, customerRow.name)
      }
    }

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

    return {
      ...mapInvoice(row, itemRows, customerNames),
      items,
    }
  })
