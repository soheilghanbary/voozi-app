import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from '@/features/customer/api/mutations'
import { getCustomer, listCustomers } from '@/features/customer/api/queries'
import {
  createInvoice,
  deleteInvoice,
  updateInvoice,
} from '@/features/invoice/api/mutations'
import { getInvoice, listInvoices } from '@/features/invoice/api/queries'
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/features/product/api/mutations'
import { getProduct, listProducts } from '@/features/product/api/queries'

export const router = {
  customers: {
    create: createCustomer,
    update: updateCustomer,
    delete: deleteCustomer,
    list: listCustomers,
    get: getCustomer,
  },
  products: {
    create: createProduct,
    update: updateProduct,
    delete: deleteProduct,
    list: listProducts,
    get: getProduct,
  },
  invoices: {
    create: createInvoice,
    update: updateInvoice,
    delete: deleteInvoice,
    list: listInvoices,
    get: getInvoice,
  },
}
