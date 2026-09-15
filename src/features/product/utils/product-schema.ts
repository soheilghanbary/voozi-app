import { z } from 'zod'
import {
  PRODUCT_TYPE,
  PRODUCT_UNITS,
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

export const productFormSchema = z.object({
  name: z.string().trim().min(3, 'نام محصول حداقل ۳ حرف باشد'),
  productType: z.enum(productTypeKeys, {
    message: 'نوع را انتخاب کنید',
  }),
  unit: z.enum(productUnitKeys, {
    message: 'واحد اندازه‌گیری را انتخاب کنید',
  }),
  basePrice: z
    .number({ message: 'قیمت پایه را به صورت عدد وارد کنید' })
    .min(0, 'قیمت پایه نمی‌تواند منفی باشد'),
  description: z
    .string()
    .trim()
    .max(500, 'توضیحات حداکثر ۵۰۰ حرف باشد')
    .optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
