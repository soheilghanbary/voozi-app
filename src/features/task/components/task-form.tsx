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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Task } from '../types'
import {
  PRIORITIES,
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  type TaskPriority,
} from '../utils/task-priority'
import { type TaskFormValues, taskFormSchema } from '../utils/task-schema'

const emptyForm: TaskFormValues = {
  title: '',
  description: '',
  priority: 'medium',
}

function toFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
  }
}

export function TaskForm({
  task,
  onSubmit,
  onSaved,
  onCancelled,
}: {
  task?: Task
  onSubmit: (values: TaskFormValues) => void
  onSaved?: () => void
  onCancelled?: () => void
}) {
  const {
    register,
    handleSubmit: rhfSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task ? toFormValues(task) : emptyForm,
  })

  const priority = watch('priority')

  function handleSubmit(values: TaskFormValues) {
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
            placeholder="مثلاً: ارسال فاکتور به آریا"
            {...register('title')}
          />
          <FieldError>{errors.title?.message}</FieldError>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>
          توضیحات <span className="text-muted-foreground">(اختیاری)</span>
        </FieldLabel>
        <FieldContent>
          <Textarea
            rows={4}
            placeholder="جزئیات وظیفه را بنویسید..."
            aria-invalid={!!errors.description}
            {...register('description')}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>اولویت</FieldLabel>
        <FieldContent>
          <Tabs
            value={priority}
            onValueChange={(value) =>
              setValue('priority', value as TaskPriority, {
                shouldValidate: true,
              })
            }
          >
            <TabsList className="gap-1 rounded-xl! border-0! bg-muted! p-1!">
              {PRIORITIES.map((option) => {
                const selected = priority === option
                return (
                  <TabsTrigger
                    key={option}
                    value={option}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-sm transition-all duration-150',
                      selected
                        ? 'bg-card shadow-sm data-active:bg-card! data-active:text-foreground!'
                        : 'text-foreground/60 hover:text-foreground'
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'size-1.5 rounded-full',
                        PRIORITY_STYLES[option].dot
                      )}
                    />
                    {PRIORITY_LABELS[option]}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </FieldContent>
      </Field>
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {task ? 'ثبت تغییرات' : 'ثبت وظیفه'}
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
