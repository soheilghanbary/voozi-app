import { defineRelations } from 'drizzle-orm'
import {
  account,
  customer,
  invoice,
  invoiceItem,
  product,
  session,
  user,
} from './schema'

export const relations = defineRelations(
  {
    user,
    session,
    account,
    customer,
    product,
    invoice,
    invoiceItem,
  },
  (r) => ({
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      customers: r.many.customer(),
      products: r.many.product(),
      invoices: r.many.invoice(),
    },
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },
    customer: {
      user: r.one.user({
        from: r.customer.userId,
        to: r.user.id,
      }),
      invoices: r.many.invoice(),
    },
    product: {
      user: r.one.user({
        from: r.product.userId,
        to: r.user.id,
      }),
      invoiceItems: r.many.invoiceItem(),
    },
    invoice: {
      user: r.one.user({
        from: r.invoice.userId,
        to: r.user.id,
      }),
      customer: r.one.customer({
        from: r.invoice.customerId,
        to: r.customer.id,
      }),
      items: r.many.invoiceItem(),
    },
    invoiceItem: {
      invoice: r.one.invoice({
        from: r.invoiceItem.invoiceId,
        to: r.invoice.id,
      }),
      product: r.one.product({
        from: r.invoiceItem.productId,
        to: r.product.id,
      }),
    },
  })
)
