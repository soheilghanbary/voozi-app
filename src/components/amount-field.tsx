import { useEffect, useRef, useState } from 'react'
import { TextField } from '@/components/ui/text-field'

const persianFormatter = new Intl.NumberFormat('fa-IR', {
  maximumFractionDigits: 0,
})

const toEnglishDigits = (str: string) =>
  str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632))

const parse = (val: string) => {
  const digits = toEnglishDigits(val).replace(/[^0-9]/g, '')
  return digits ? Number(digits) : 0
}

const format = (val: number) => (val ? persianFormatter.format(val) : '')

type Props = {
  value: number
  onChange: (value: number) => void
  label?: string
  disabled?: boolean
  error?: string
}

export const AmountField = ({
  value,
  onChange,
  label = 'مبلغ (تومان)',
  disabled,
  error,
}: Props) => {
  const [text, setText] = useState(() => format(value))
  const inputRef = useRef<HTMLInputElement>(null)

  // sync فقط وقتی فیلد در حال ویرایش نیست
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setText(format(value))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parse(e.target.value)
    setText(format(numeric))
    onChange(numeric)
  }

  return (
    <TextField
      ref={inputRef}
      type="text"
      label={label}
      inputMode="numeric"
      value={text}
      disabled={disabled}
      onChange={handleChange}
      error={error}
      inputClass="text-base font-bold"
    />
  )
}
