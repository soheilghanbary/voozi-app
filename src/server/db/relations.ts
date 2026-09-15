import { defineRelations } from 'drizzle-orm'
import { account, customer, session, user } from './schema'

export const relations = defineRelations(
  { user, session, account, customer },
  (r) => ({
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      customers: r.many.customer(),
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
    },
  })
)
