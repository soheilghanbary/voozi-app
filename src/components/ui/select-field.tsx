import { useId } from 'react'
import { cn } from '@/lib/utils'
import { Label } from './label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'

type SelectFieldOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  label: string
  value: string
  onChange: (value: string | null) => void
  options: SelectFieldOption[]
  placeholder?: string
  error?: string
  className?: string
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'انتخاب کنید...',
  error,
  className,
}: SelectFieldProps) {
  const id = useId()
  return (
    <div className={cn('grid gap-2 [&>label]:text-sm', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue>
            {(selected) =>
              selected
                ? (options.find((option) => option.value === selected)?.label ??
                  placeholder)
                : placeholder
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <span className="-mt-1 font-medium text-destructive text-xs">
          {error}
        </span>
      )}
    </div>
  )
}
