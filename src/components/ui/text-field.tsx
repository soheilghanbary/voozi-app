import {
  type ForwardedRef,
  forwardRef,
  type InputHTMLAttributes,
  useId,
} from 'react'
import { cn } from '@/lib/utils'
import { Input } from './input'
import { Label } from './label'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  description?: string
  error?: string
  inputClass?: string
}

export const TextField = forwardRef(function MyInput(
  { label, description, error, className, inputClass, ...rest }: TextFieldProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const id = useId()
  return (
    <div className={cn('grid gap-2 [&>label]:text-sm', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        ref={ref}
        type="text"
        autoComplete="off"
        className={inputClass}
        {...rest}
      />
      {description && (
        <span className="text-muted-foreground text-xs">{description}</span>
      )}
      {error && (
        <span className="-mt-1 font-medium text-destructive text-xs">
          {error}
        </span>
      )}
    </div>
  )
})
