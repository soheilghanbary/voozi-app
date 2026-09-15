import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from '@/features/customer/api/mutations'
import { getCustomer, listCustomers } from '@/features/customer/api/queries'

export const router = {
  customers: {
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
    list: listCustomers,
    get: getCustomer,
  },
}
