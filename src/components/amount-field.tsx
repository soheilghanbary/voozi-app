import type { FocusEvent } from 'react'
import { TextField } from '@/components/ui/text-field'

type Props = {
  value: number
  onChange: (value: number) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  error?: string
}

const convertToEnglishDigits = (str: string) => {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632))
}

export const AmountField = ({
  value,
  onChange,
  onBlur,
  label,
  disabled,
  error,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const englishInput = convertToEnglishDigits(e.target.value)
    const rawVal = englishInput.replace(/[^0-9]/g, '')
    const numberVal = rawVal === '' ? 0 : Number(rawVal)
    onChange(numberVal)
  }

  return (
    <TextField
      type="text"
      label={label ?? 'مبلغ (تومان)'}
      inputMode="numeric"
      value={value ? value.toLocaleString('fa-IR') : ''}
      disabled={disabled}
      onChange={handleChange}
      onBlur={onBlur}
      error={error}
    />
  )
}
