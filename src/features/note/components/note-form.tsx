'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Note } from '../types'
import {
  NOTE_COLOR_LABELS,
  NOTE_COLOR_STYLES,
  NOTE_COLORS,
} from '../utils/note-colors'
import { type NoteFormValues, noteFormSchema } from '../utils/note-schema'

const emptyForm: NoteFormValues = {
  title: '',
  content: '',
  color: 'teal',
}

function toFormValues(note: Note): NoteFormValues {
  return {
    title: note.title,
    content: note.content,
    color: note.color,
  }
}

export function NoteForm({
  note,
  onSubmit,
  onSaved,
  onCancelled,
}: {
  note?: Note
  onSubmit: (values: NoteFormValues) => void
  onSaved?: () => void
  onCancelled?: () => void
}) {
  const {
    register,
    handleSubmit: rhfSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: note ? toFormValues(note) : emptyForm,
  })

  const color = watch('color')

  function handleSubmit(values: NoteFormValues) {
    onSubmit(values)
    onSaved?.()
  }

  return (
    <form onSubmit={rhfSubmit(handleSubmit)} className="space-y-5">
      <Field>
        <FieldLabel>عنوان</FieldLabel>
        <FieldContent>
          <Input
            aria-invalid={!!errors.title}
            placeholder="مثلاً: تماس با مشتری آریا"
            {...register('title')}
          />
          <FieldError>{errors.title?.message}</FieldError>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>
          متن یادداشت <span className="text-muted-foreground">(اختیاری)</span>
        </FieldLabel>
        <FieldContent>
          <Textarea
            rows={7}
            placeholder="جزئیات یادداشت را بنویسید..."
            aria-invalid={!!errors.content}
            {...register('content')}
          />
          <FieldError>{errors.content?.message}</FieldError>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>رنگ یادداشت</FieldLabel>
        <FieldContent>
          <div className="flex items-center gap-2.5 pt-1">
            {NOTE_COLORS.map((option) => {
              const selected = color === option
              return (
                <button
                  key={option}
                  type="button"
                  aria-label={NOTE_COLOR_LABELS[option]}
                  aria-pressed={selected}
                  onClick={() =>
                    setValue('color', option, { shouldValidate: true })
                  }
                  className={cn(
                    'size-7 rounded-full ring-2 ring-offset-2 ring-offset-background',
                    'transition-all duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-foreground/40 active:scale-95',
                    NOTE_COLOR_STYLES[option].swatch,
                    selected
                      ? 'scale-110 ring-foreground/25'
                      : 'ring-transparent'
                  )}
                />
              )
            })}
          </div>
        </FieldContent>
      </Field>
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {note ? 'ثبت تغییرات' : 'ثبت یادداشت'}
        </Button>
        {onCancelled && (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancelled}
          >
            انصراف
          </Button>
        )}
      </div>
    </form>
  )
}
