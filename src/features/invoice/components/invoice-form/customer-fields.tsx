'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { AmountField } from '@/components/amount-field'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import type { Customer } from '@/features/customer/types'
import type { InvoiceFormValues } from '../../utils/invoice-schema'

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
    <div className="grid gap-5 md:grid-cols-12">
      <Field className="md:col-span-6">
        <FieldLabel>مشتری</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="customerId"
            render={({ field }) => (
              <Combobox
                items={customers}
                itemToStringLabel={(customer) => customer.name}
                itemToStringValue={(customer) => customer.id}
                value={
                  customers.find((customer) => customer.id === field.value) ??
                  null
                }
                onValueChange={(customer) => field.onChange(customer?.id ?? '')}
              >
                <ComboboxInput
                  placeholder="جستجوی مشتری..."
                  aria-invalid={!!errors.customerId}
                  onBlur={field.onBlur}
                />
                <ComboboxContent>
                  <ComboboxEmpty>مشتری‌ای یافت نشد.</ComboboxEmpty>
                  <ComboboxList>
                    {(customer: Customer) => (
                      <ComboboxItem key={customer.id} value={customer}>
                        <span className="truncate font-medium">
                          {customer.name}
                        </span>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
          <FieldError>{errors.customerId?.message}</FieldError>
        </FieldContent>
      </Field>

      <div className="md:col-span-3">
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
      </div>

      <div className="md:col-span-3">
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
