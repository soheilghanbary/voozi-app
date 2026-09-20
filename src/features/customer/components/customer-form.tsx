'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
import { api } from '@/server/orpc/client'
import type { Customer } from '../types'
import { CUSTOMER_TYPE, type CustomerType } from '../types'
import {
  type CustomerFormValues,
  customerFormSchema,
} from '../utils/customer-schema'

const emptyForm: CustomerFormValues = {
  name: '',
  customerType: 'individual',
  mobile: '',
  phone: '',
  address: '',
}

function toFormValues(customer: Customer): CustomerFormValues {
  return {
    name: customer.name,
    customerType: customer.customerType,
    mobile: customer.mobile,
    phone: customer.phone,
    address: customer.address,
  }
}

export function CustomerForm({
  customer,
  onSaved,
  onCancelled,
}: {
  customer?: Customer
  onSaved?: () => void
  onCancelled?: () => void
}) {
  const router = useRouter()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer ? toFormValues(customer) : emptyForm,
  })

  async function onSubmit(values: CustomerFormValues) {
    try {
      if (customer) {
        await api.customers.update({ id: customer.id, ...values })
        toast.success('مشتری با موفقیت ویرایش شد.')
      } else {
        await api.customers.create(values)
        toast.success('مشتری جدید با موفقیت افزوده شد.')
      }
      router.refresh()
      onSaved?.()
    } catch {
      toast.error('ثبت مشتری ناموفق بود. دوباره تلاش کنید.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <fieldset disabled={isSubmitting} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field className="col-span-2 flex-row">
            <FieldLabel>نوع مشتری</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="customerType"
                render={({ field }) => (
                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList>
                      {(Object.keys(CUSTOMER_TYPE) as CustomerType[]).map(
                        (customerType) => (
                          <TabsTrigger key={customerType} value={customerType}>
                            {CUSTOMER_TYPE[customerType].label}
                          </TabsTrigger>
                        )
                      )}
                    </TabsList>
                  </Tabs>
                )}
              />
              <FieldError>{errors.customerType?.message}</FieldError>
            </FieldContent>
          </Field>
          <Field className="col-span-2">
            <FieldLabel>نام مشتری / شرکت</FieldLabel>
            <FieldContent>
              <Input aria-invalid={!!errors.name} {...register('name')} />
              <FieldError>{errors.name?.message}</FieldError>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>شماره تماس</FieldLabel>
            <FieldContent>
              <Input
                dir="ltr"
                inputMode="numeric"
                aria-invalid={!!errors.mobile}
                {...register('mobile')}
              />
              <FieldError>{errors.mobile?.message}</FieldError>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>
              تلفن <span className="text-muted-foreground">(اختیاری)</span>
            </FieldLabel>
            <FieldContent>
              <Input
                dir="ltr"
                inputMode="numeric"
                aria-invalid={!!errors.phone}
                {...register('phone')}
              />
              <FieldError>{errors.phone?.message}</FieldError>
            </FieldContent>
          </Field>
        </div>
        <Field>
          <FieldLabel>
            آدرس <span className="text-muted-foreground">(اختیاری)</span>
          </FieldLabel>
          <FieldContent>
            <Textarea
              aria-invalid={!!errors.address}
              {...register('address')}
            />
            <FieldError>{errors.address?.message}</FieldError>
          </FieldContent>
        </Field>
      </fieldset>
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          ذخیره
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
