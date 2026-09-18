import { z } from 'zod'
import { NOTE_COLORS } from './note-colors'

export const noteFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'عنوان یادداشت را وارد کنید')
    .max(120, 'عنوان حداکثر ۱۲۰ حرف باشد'),
  content: z
    .string()
    .trim()
    .max(2000, 'متن یادداشت حداکثر ۲۰۰۰ حرف باشد')
    .optional(),
  color: z.enum(NOTE_COLORS),
})

export type NoteFormValues = z.infer<typeof noteFormSchema>
