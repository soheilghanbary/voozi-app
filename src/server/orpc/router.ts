import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from '@/features/customer/api/mutations'
import { getCustomer, listCustomers } from '@/features/customer/api/queries'
import {
  createInvoice,
  deleteInvoice,
  deleteManyInvoices,
  updateInvoice,
} from '@/features/invoice/api/mutations'
import { getInvoice, listInvoices } from '@/features/invoice/api/queries'
import {
  createNote,
  deleteNote,
  updateNote,
} from '@/features/note/api/mutations'
import { getNote, listNotes } from '@/features/note/api/queries'
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/features/product/api/mutations'
import { getProduct, listProducts } from '@/features/product/api/queries'
import { updateBusinessProfile } from '@/features/settings/api/mutations'
import { getBusinessProfile } from '@/features/settings/api/queries'

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
  notes: {
    create: createNote,
    update: updateNote,
    delete: deleteNote,
    list: listNotes,
    get: getNote,
  },
  invoices: {
    create: createInvoice,
    update: updateInvoice,
    delete: deleteInvoice,
    deleteMany: deleteManyInvoices,
    list: listInvoices,
    get: getInvoice,
  },
  settings: {
    get: getBusinessProfile,
    update: updateBusinessProfile,
  },
}
