'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ORPCError } from '@orpc/client'
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
import { SelectField } from '@/components/ui/select-field'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
}

function toFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    productType: product.productType,
    unit: product.unit,
    basePrice: product.basePrice,
  }
}

export function ProductForm({
  product,
  onSaved,
  onCancelled,
}: {
  product?: Product
  onSaved?: () => void
  onCancelled?: () => void
}) {
  const router = useRouter()
  const {
    register,
    control,
    handleSubmit,
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
        router.refresh()
        onSaved?.()
      } else {
        await api.products.create(values)
        toast.success('محصول جدید با موفقیت ثبت شد.')
        router.refresh()
        onSaved?.()
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
      <fieldset disabled={isSubmitting} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field className="col-span-2 flex-row">
            <FieldLabel>نوع محصول</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="productType"
                render={({ field }) => (
                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList>
                      {(Object.keys(PRODUCT_TYPE) as ProductType[]).map(
                        (productType) => (
                          <TabsTrigger key={productType} value={productType}>
                            {PRODUCT_TYPE[productType].label}
                          </TabsTrigger>
                        )
                      )}
                    </TabsList>
                  </Tabs>
                )}
              />
              <FieldError>{errors.productType?.message}</FieldError>
            </FieldContent>
          </Field>
          <Field className="col-span-2">
            <FieldLabel>نام</FieldLabel>
            <FieldContent>
              <Input aria-invalid={!!errors.name} {...register('name')} />
              <FieldError>{errors.name?.message}</FieldError>
            </FieldContent>
          </Field>
          <Controller
            control={control}
            name="unit"
            render={({ field }) => (
              <SelectField
                label="واحد اندازه‌گیری"
                value={field.value}
                onChange={field.onChange}
                options={(Object.keys(PRODUCT_UNITS) as ProductUnit[]).map(
                  (unit) => ({
                    value: unit,
                    label: PRODUCT_UNITS[unit].label,
                  })
                )}
                placeholder="واحد"
                error={errors.unit?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="basePrice"
            render={({ field }) => (
              <AmountField
                label="قیمت پایه"
                value={field.value}
                onChange={field.onChange}
                error={errors.basePrice?.message}
              />
            )}
          />
        </div>
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
