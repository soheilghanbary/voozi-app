import { z } from 'zod'
import { PRIORITIES } from './task-priority'

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'عنوان وظیفه را وارد کنید')
    .max(120, 'عنوان حداکثر ۱۲۰ حرف باشد'),
  description: z
    .string()
    .trim()
    .max(1000, 'توضیحات حداکثر ۱۰۰۰ حرف باشد')
    .optional(),
  priority: z.enum(PRIORITIES),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
