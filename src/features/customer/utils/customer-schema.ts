import { z } from 'zod'

export const customerFormSchema = z.object({
  name: z.string().trim().min(3, 'نام مشتری حداقل ۳ حرف باشد'),
  customerType: z.enum(['individual', 'corporate'], {
    message: 'نوع مشتری را انتخاب کنید',
  }),
  mobile: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, 'شماره تماس معتبر نیست (مثال: 09123456789)'),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{2,3}\d{6,8}$/, 'تلفن معتبر نیست (مثال: 02188776655)')
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .refine((value) => value === '' || value.length >= 5, 'آدرس را وارد کنید'),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>
