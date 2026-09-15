import { z } from 'zod'

export const invoiceItemFormSchema = z.object({
  productId: z.string().nullable().optional(),
  name: z.string().trim().min(1, 'نام کالا یا خدمات را وارد کنید'),
  unit: z.string().trim().min(1, 'واحد را وارد کنید'),
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

export const invoiceFormSchema = z.object({
  customerId: z.string().trim().min(1, 'مشتری را انتخاب کنید'),
  discount: z
    .number({ message: 'تخفیف را وارد کنید' })
    .min(0, 'تخفیف نمی‌تواند منفی باشد'),
  taxRate: z
    .number({ message: 'درصد مالیات را وارد کنید' })
    .min(0, 'درصد مالیات نمی‌تواند منفی باشد')
    .max(100, 'درصد مالیات حداکثر ۱۰۰ است'),
  note: z.string().trim().max(500, 'یادداشت حداکثر ۵۰۰ حرف باشد').optional(),
  items: z
    .array(invoiceItemFormSchema)
    .min(1, 'حداقل یک ردیف به فاکتور اضافه کنید'),
})

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>
