'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ORPCError } from '@orpc/client'
import { Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { Customer } from '@/features/customer/types'
import { PRODUCT_UNITS, type Product } from '@/features/product/types'
import { api } from '@/server/orpc/client'
import { INVOICE_TYPE, type InvoiceDetail, type InvoiceType } from '../types'
import { numberFormatter } from '../utils/format'
import {
  type InvoiceFormValues,
  invoiceFormSchema,
} from '../utils/invoice-schema'

const NO_PRODUCT = '__none__'

const emptyItem: InvoiceFormValues['items'][number] = {
  productId: null,
  name: '',
  unit: '',
  quantity: 1,
  unitPrice: 0,
  discount: 0,
}

const emptyForm: InvoiceFormValues = {
  type: 'invoice',
  customerId: '',
  discount: 0,
  taxRate: 0,
  note: '',
  items: [emptyItem],
}

const convertToEnglishDigits = (str: string) => {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632))
}

function NumericCell({
  value,
  onValueChange,
  placeholder,
}: {
  value: number
  onValueChange: (value: number) => void
  placeholder?: string
}) {
  return (
    <Input
      dir="ltr"
      inputMode="decimal"
      className="text-center tabular-nums"
      placeholder={placeholder}
      value={
        value ? value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : ''
      }
      onChange={(event) => {
        const english = convertToEnglishDigits(event.target.value)
        const cleaned = english.replace(/[^0-9.]/g, '')
        const num = cleaned === '' ? 0 : Number(cleaned)
        onValueChange(Number.isFinite(num) ? num : 0)
      }}
    />
  )
}

function computeTotals(
  items: InvoiceFormValues['items'],
  discount: number,
  taxRate: number
) {
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Math.max(
        0,
        (item.quantity || 0) * (item.unitPrice || 0) - (item.discount || 0)
      ),
    0
  )
  const afterDiscount = Math.max(0, subtotal - discount)
  const tax = Math.round((afterDiscount * taxRate) / 100)
  return { subtotal, afterDiscount, tax, total: afterDiscount + tax }
}

function toFormValues(invoice: InvoiceDetail): InvoiceFormValues {
  return {
    type: invoice.type,
    customerId: invoice.customerId ?? '',
    discount: invoice.discount,
    taxRate: invoice.taxRate,
    note: invoice.note,
    items: invoice.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
    })),
  }
}

export function InvoiceForm({
  invoice,
  customers,
  products,
}: {
  invoice?: InvoiceDetail
  customers: Customer[]
  products: Product[]
}) {
  const router = useRouter()

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: invoice ? toFormValues(invoice) : emptyForm,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const items = useWatch({ control, name: 'items' })
  const discount = useWatch({ control, name: 'discount' }) ?? 0
  const taxRate = useWatch({ control, name: 'taxRate' }) ?? 0

  const totals = useMemo(
    () => computeTotals(items ?? [], discount, taxRate),
    [items, discount, taxRate]
  )

  async function onSubmit(values: InvoiceFormValues) {
    try {
      if (invoice) {
        await api.invoices.update({ id: invoice.id, ...values })
        toast.success('فاکتور با موفقیت ویرایش شد.')
        router.push('/dashboard/invoices')
        router.refresh()
      } else {
        await api.invoices.create(values)
        toast.success('فاکتور جدید با موفقیت ثبت شد.')
        router.push('/dashboard/invoices')
        router.refresh()
      }
    } catch (error) {
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این فاکتور یافت نشد.')
      } else {
        toast.error('ثبت فاکتور ناموفق بود. دوباره تلاش کنید.')
      }
    }
  }

  function handleProductChange(itemIndex: number, productId: string | null) {
    setValue(
      `items.${itemIndex}.productId`,
      productId === NO_PRODUCT ? null : productId
    )
    const product = products.find((item) => item.id === productId)
    if (product) {
      setValue(`items.${itemIndex}.name`, product.name)
      setValue(`items.${itemIndex}.unit`, PRODUCT_UNITS[product.unit].label)
      setValue(`items.${itemIndex}.unitPrice`, product.basePrice)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Tabs value={field.value} onValueChange={field.onChange}>
            <TabsList>
              {(Object.keys(INVOICE_TYPE) as InvoiceType[]).map((type) => (
                <TabsTrigger key={type} value={type}>
                  {INVOICE_TYPE[type].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel>مشتری</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="customerId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="انتخاب مشتری..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.customerId?.message}</FieldError>
          </FieldContent>
        </Field>
        <Controller
          control={control}
          name="discount"
          render={({ field }) => (
            <AmountField
              label="تخفیف (تومان)"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
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
              onBlur={field.onBlur}
              error={errors.taxRate?.message}
            />
          )}
        />
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold">اقلام فاکتور</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append(emptyItem)}
          >
            <Plus />
            افزودن ردیف
          </Button>
        </div>
        {errors.items?.root?.message ? (
          <p className="text-destructive text-sm">
            {errors.items.root.message}
          </p>
        ) : null}
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap items-start gap-3 rounded-lg border p-3"
            >
              <Field className="w-full lg:w-56">
                <FieldLabel>کالا یا خدمت</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={`items.${index}.productId`}
                    render={({ field: productField }) => (
                      <Select
                        value={productField.value ?? null}
                        onValueChange={(value) =>
                          handleProductChange(index, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="انتخاب..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NO_PRODUCT}>
                            بدون انتخاب
                          </SelectItem>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldContent>
              </Field>
              <Field className="min-w-40 flex-1">
                <FieldLabel>نام</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="نام کالا یا خدمات"
                    aria-invalid={!!errors.items?.[index]?.name}
                    {...register(`items.${index}.name`)}
                  />
                  <FieldError>
                    {errors.items?.[index]?.name?.message}
                  </FieldError>
                </FieldContent>
              </Field>
              <Field className="w-full lg:w-24">
                <FieldLabel>واحد</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="مثلاً: عدد"
                    aria-invalid={!!errors.items?.[index]?.unit}
                    {...register(`items.${index}.unit`)}
                  />
                  <FieldError>
                    {errors.items?.[index]?.unit?.message}
                  </FieldError>
                </FieldContent>
              </Field>
              <Field className="w-full lg:w-24">
                <FieldLabel>تعداد</FieldLabel>
                <FieldContent>
                  <NumericCell
                    value={items?.[index]?.quantity ?? 0}
                    placeholder="1"
                    onValueChange={(value) =>
                      setValue(`items.${index}.quantity`, value)
                    }
                  />
                  <FieldError>
                    {errors.items?.[index]?.quantity?.message}
                  </FieldError>
                </FieldContent>
              </Field>
              <Field className="w-full lg:w-28">
                <FieldLabel>قیمت واحد</FieldLabel>
                <FieldContent>
                  <NumericCell
                    value={items?.[index]?.unitPrice ?? 0}
                    onValueChange={(value) =>
                      setValue(`items.${index}.unitPrice`, value)
                    }
                  />
                  <FieldError>
                    {errors.items?.[index]?.unitPrice?.message}
                  </FieldError>
                </FieldContent>
              </Field>
              <Field className="w-full lg:w-28">
                <FieldLabel>تخفیف</FieldLabel>
                <FieldContent>
                  <NumericCell
                    value={items?.[index]?.discount ?? 0}
                    onValueChange={(value) =>
                      setValue(`items.${index}.discount`, value)
                    }
                  />
                  <FieldError>
                    {errors.items?.[index]?.discount?.message}
                  </FieldError>
                </FieldContent>
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="mt-7 text-muted-foreground"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
                aria-label="حذف ردیف"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-full space-y-1 rounded-lg border p-4 text-sm sm:max-w-sm">
          <div className="flex justify-between">
            <span>جمع کالاها</span>
            <span className="tabular-nums">
              {numberFormatter.format(totals.subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>تخفیف</span>
            <span className="tabular-nums">
              {numberFormatter.format(discount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>مالیات ({numberFormatter.format(taxRate)}٪)</span>
            <span className="tabular-nums">
              {numberFormatter.format(totals.tax)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>جمع کل</span>
            <span className="tabular-nums">
              {numberFormatter.format(totals.total)}
            </span>
          </div>
        </div>
      </div>

      <Field>
        <FieldLabel>
          یادداشت <span className="text-muted-foreground">(اختیاری)</span>
        </FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="یادداشت روی فاکتور..."
            aria-invalid={!!errors.note}
            {...register('note')}
          />
          <FieldError>{errors.note?.message}</FieldError>
        </FieldContent>
      </Field>

      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? invoice
              ? 'در حال ثبت تغییرات…'
              : 'در حال ثبت…'
            : invoice
              ? 'ثبت تغییرات'
              : 'ثبت فاکتور'}
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          disabled={isSubmitting}
          render={<Link href="/dashboard/invoices" />}
        >
          انصراف
        </Button>
      </div>
    </form>
  )
}
