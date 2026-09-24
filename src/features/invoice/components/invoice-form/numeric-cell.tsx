'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

const convertToEnglishDigits = (str: string) => {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632))
}

const formatNumeric = (value: number) =>
  value ? value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : ''

const formatLive = (str: string) => {
  const [intPart, fracPart] = str.split('.')
  const grouped = intPart
    ? Number.parseInt(intPart, 10).toLocaleString('en-US')
    : ''
  return fracPart === undefined ? grouped : `${grouped}.${fracPart}`
}

export function NumericCell({
  id,
  value,
  onValueChange,
  onEnter,
  placeholder,
}: {
  id?: string
  value: number
  onValueChange: (value: number) => void
  onEnter?: () => void
  placeholder?: string
}) {
  const [text, setText] = useState(() => formatNumeric(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setText(formatNumeric(value))
  }, [value, focused])

  return (
    <Input
      id={id}
      dir="ltr"
      inputMode="decimal"
      className="text-center tabular-nums"
      placeholder={placeholder}
      value={text}
      onFocus={(event) => {
        setFocused(true)
        event.target.select()
      }}
      onChange={(event) => {
        const english = convertToEnglishDigits(event.target.value)
        const cleaned = english
          .replace(/[^0-9.]/g, '')
          .replace(/(\..*)\./g, '$1')
        setText(formatLive(cleaned))
        const num = cleaned === '' ? 0 : Number(cleaned)
        onValueChange(Number.isFinite(num) ? num : 0)
      }}
      onBlur={() => {
        setFocused(false)
        setText(formatNumeric(value))
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter') return
        event.preventDefault()
        onEnter?.()
      }}
    />
  )
}
