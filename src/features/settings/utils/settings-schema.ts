import { z } from 'zod'
import { CURRENCY, type Currency } from '../types'

const typeKeys = Object.keys(CURRENCY) as [Currency, ...Currency[]]

const dataUrl = (field: string) =>
  z.string().max(3_000_000, `${field} خیلی بزرگ است`).optional()

export const businessProfileFormSchema = z.object({
  name: z.string().trim().max(60, 'نام حداکثر ۶۰ حرف باشد').optional(),
  title: z.string().trim().max(80, 'عنوان حداکثر ۸۰ حرف باشد').optional(),
  description: z
    .string()
    .trim()
    .max(300, 'توضیحات حداکثر ۳۰۰ حرف باشد')
    .optional(),
  logo: dataUrl('لوگو'),
  signature: dataUrl('امضا'),
  currency: z.enum(typeKeys).optional(),
})

export type BusinessProfileFormValues = z.infer<
  typeof businessProfileFormSchema
>
