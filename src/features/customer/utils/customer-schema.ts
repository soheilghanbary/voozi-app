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
    .regex(/^0\d{2,3}\d{6,8}$/, 'تلفن معتبر نیست (مثال: 02188776655)'),
  address: z.string().trim().min(5, 'آدرس را وارد کنید'),
  nationalId: z
    .string()
    .trim()
    .regex(/^\d{10}$|^\d{11}$/, 'شناسه ملی یا کد ملی نامعتبر است'),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>
