'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ORPCError } from '@orpc/client'
import Link from 'next/link'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/server/orpc/client'
import type { Customer } from '../types'
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
  nationalId: '',
}

function toFormValues(customer: Customer): CustomerFormValues {
  return {
    name: customer.name,
    customerType: customer.customerType,
    mobile: customer.mobile,
    phone: customer.phone,
    address: customer.address,
    nationalId: customer.nationalId,
  }
}

export function CustomerForm({ customer }: { customer?: Customer }) {
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
      router.push('/dashboard/customers')
      router.refresh()
    } catch (error) {
      if (error instanceof ORPCError && error.code === 'CONFLICT') {
        toast.error('این شناسه ملی یا کد ملی قبلاً ثبت شده است.')
      } else {
        toast.error('ثبت مشتری ناموفق بود. دوباره تلاش کنید.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel>نام مشتری</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={!!errors.name}
              placeholder="مثلاً: علی رضایی"
              {...register('name')}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>حقیقی یا حقوقی</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="customerType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value) =>
                        value === 'individual'
                          ? 'حقیقی'
                          : value === 'corporate'
                            ? 'حقوقی'
                            : 'نوع مشتری'
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">حقیقی</SelectItem>
                    <SelectItem value="corporate">حقوقی</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.customerType?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>شماره تماس</FieldLabel>
          <FieldContent>
            <Input
              dir="ltr"
              inputMode="numeric"
              placeholder="09123456789"
              aria-invalid={!!errors.mobile}
              {...register('mobile')}
            />
            <FieldError>{errors.mobile?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>تلفن</FieldLabel>
          <FieldContent>
            <Input
              dir="ltr"
              inputMode="numeric"
              placeholder="02188776655"
              aria-invalid={!!errors.phone}
              {...register('phone')}
            />
            <FieldError>{errors.phone?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>شناسه ملی یا کد ملی</FieldLabel>
          <FieldContent>
            <Input
              dir="ltr"
              inputMode="numeric"
              placeholder="2283409915"
              aria-invalid={!!errors.nationalId}
              {...register('nationalId')}
            />
            <FieldError>{errors.nationalId?.message}</FieldError>
          </FieldContent>
        </Field>
      </div>
      <Field>
        <FieldLabel>آدرس</FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲"
            aria-invalid={!!errors.address}
            {...register('address')}
          />
          <FieldError>{errors.address?.message}</FieldError>
        </FieldContent>
      </Field>
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? customer
              ? 'در حال ثبت تغییرات…'
              : 'در حال ثبت…'
            : customer
              ? 'ثبت تغییرات'
              : 'ثبت مشتری'}
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          disabled={isSubmitting}
          render={<Link href="/dashboard/customers" />}
        >
          انصراف
        </Button>
      </div>
    </form>
  )
}
