import { z } from 'zod'
import { INVOICE_TYPE, type InvoiceType } from '../types'

const typeKeys = Object.keys(INVOICE_TYPE) as [InvoiceType, ...InvoiceType[]]

const invoiceItemBaseSchema = z.object({
  productId: z.string().nullable().optional(),
  quantity: z
    .number({ message: 'تعداد را وارد کنید' })
    .positive('تعداد باید بیشتر از صفر باشد'),
  unitPrice: z
    .number({ message: 'قیمت واحد را وارد کنید' })
    .min(0, 'قیمت واحد نمی‌تواند منفی باشد'),
  discount: z
    .number({ message: 'تخفیف را وارد کنید' })
    .min(0, 'تخفیف نمی‌تواند منفی باشد'),
})

export const invoiceItemFormSchema = invoiceItemBaseSchema.extend({
  name: z.string().trim().optional(),
  unit: z.string().trim().optional(),
})

export const invoiceItemApiSchema = invoiceItemBaseSchema.extend({
  name: z.string().trim().min(1, 'نام کالا یا خدمات را وارد کنید'),
  unit: z.string().trim().min(1, 'واحد را وارد کنید'),
})

const invoiceBaseSchema = z.object({
  type: z.enum(typeKeys, {
    message: 'نوع فاکتور را انتخاب کنید',
  }),
  customerId: z.string().trim().min(1, 'مشتری را انتخاب کنید'),
  discount: z
    .number({ message: 'تخفیف را وارد کنید' })
    .min(0, 'تخفیف نمی‌تواند منفی باشد'),
  taxRate: z
    .number({ message: 'درصد مالیات را وارد کنید' })
    .min(0, 'درصد مالیات نمی‌تواند منفی باشد')
    .max(100, 'درصد مالیات حداکثر ۱۰۰ است'),
  note: z.string().trim().max(500, 'یادداشت حداکثر ۵۰۰ حرف باشد').optional(),
  signature: z.boolean(),
})

export const invoiceFormSchema = invoiceBaseSchema.extend({
  items: z.array(invoiceItemFormSchema).superRefine((items, ctx) => {
    const started = items.filter(
      (item) => item.productId != null || item.name?.trim() !== ''
    )
    if (started.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['items'],
        message: 'حداقل یک ردیف به فاکتور اضافه کنید',
      })
      return
    }
    items.forEach((item, index) => {
      const isStarted = item.productId != null || item.name?.trim() !== ''
      if (!isStarted) return
      if (item.name?.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: [index, 'name'],
          message: 'نام کالا یا خدمات را وارد کنید',
        })
      }
    })
  }),
})

export const invoiceApiSchema = invoiceBaseSchema.extend({
  items: z
    .array(invoiceItemApiSchema)
    .min(1, 'حداقل یک ردیف به فاکتور اضافه کنید'),
})

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>
