'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { AmountField } from '@/components/amount-field'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import type { Customer } from '@/features/customer/types'
import type { InvoiceFormValues } from '../../utils/invoice-schema'
import { CustomerPicker } from './customer-picker'

export function CustomerFields({
  customers,
  currencyLabel,
}: {
  customers: Customer[]
  currencyLabel: string
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>()

  return (
    <div className="grid items-start gap-5 md:grid-cols-12">
      <Field className="gap-2 md:col-span-6">
        <FieldLabel>مشتری</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="customerId"
            render={({ field }) => (
              <CustomerPicker
                customers={customers}
                value={field.value}
                onChange={(customerId) => field.onChange(customerId)}
                invalid={!!errors.customerId}
              />
            )}
          />
          <FieldError>{errors.customerId?.message}</FieldError>
        </FieldContent>
      </Field>
      <div className="grid grid-cols-2 gap-4 md:col-span-6">
        <Controller
          control={control}
          name="discount"
          render={({ field }) => (
            <AmountField
              label={`تخفیف (${currencyLabel})`}
              value={field.value}
              onChange={field.onChange}
              error={errors.discount?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="taxRate"
          render={({ field }) => (
            <AmountField
              label="درصد مالیات"
              value={field.value}
              onChange={field.onChange}
              error={errors.taxRate?.message}
            />
          )}
        />
      </div>
    </div>
  )
}
