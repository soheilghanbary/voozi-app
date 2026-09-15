'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ORPCError } from '@orpc/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AmountField } from '@/components/amount-field'
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
import {
  PRODUCT_TYPE,
  PRODUCT_UNITS,
  type Product,
  type ProductType,
  type ProductUnit,
} from '../types'
import {
  type ProductFormValues,
  productFormSchema,
} from '../utils/product-schema'

const emptyForm: ProductFormValues = {
  name: '',
  productType: 'product',
  unit: 'item',
  basePrice: 0,
  description: '',
}

function toFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    productType: product.productType,
    unit: product.unit,
    basePrice: product.basePrice,
    description: product.description,
  }
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? toFormValues(product) : emptyForm,
  })

  async function onSubmit(values: ProductFormValues) {
    try {
      if (product) {
        await api.products.update({ id: product.id, ...values })
        toast.success('محصول با موفقیت ویرایش شد.')
        router.push('/dashboard/products')
        router.refresh()
      } else {
        await api.products.create(values)
        toast.success('محصول جدید با موفقیت ثبت شد.')
        router.push('/dashboard/products')
        reset(emptyForm)
      }
    } catch (error) {
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این محصول یافت نشد.')
      } else {
        toast.error('ثبت محصول ناموفق بود. دوباره تلاش کنید.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel>نام</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={!!errors.name}
              placeholder="مثلاً: استیل ضد زنگ ۳۰۴"
              {...register('name')}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>خدمات یا محصول</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="productType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value) =>
                        value
                          ? (PRODUCT_TYPE[value as ProductType]?.label ?? 'نوع')
                          : 'نوع'
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PRODUCT_TYPE) as ProductType[]).map(
                      (productType) => (
                        <SelectItem key={productType} value={productType}>
                          {PRODUCT_TYPE[productType].label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.productType?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>واحد اندازه‌گیری</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value) =>
                        value
                          ? (PRODUCT_UNITS[value as ProductUnit]?.label ??
                            'واحد')
                          : 'واحد'
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PRODUCT_UNITS) as ProductUnit[]).map(
                      (unit) => (
                        <SelectItem key={unit} value={unit}>
                          {PRODUCT_UNITS[unit].label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.unit?.message}</FieldError>
          </FieldContent>
        </Field>
        <Controller
          control={control}
          name="basePrice"
          render={({ field }) => (
            <AmountField
              label="قیمت پایه (تومان)"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.basePrice?.message}
            />
          )}
        />
      </div>
      <Field>
        <FieldLabel>
          توضیحات <span className="text-muted-foreground">(اختیاری)</span>
        </FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="توضیحات تکمیلی محصول..."
            aria-invalid={!!errors.description}
            {...register('description')}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </FieldContent>
      </Field>
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? product
              ? 'در حال ثبت تغییرات…'
              : 'در حال ثبت…'
            : product
              ? 'ثبت تغییرات'
              : 'ثبت محصول'}
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          disabled={isSubmitting}
          render={<Link href="/dashboard/products" />}
        >
          انصراف
        </Button>
      </div>
    </form>
  )
}
