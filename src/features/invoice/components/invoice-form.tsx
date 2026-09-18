'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ORPCError } from '@orpc/client'
import { FileText, Plus, ReceiptText, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { AmountField } from '@/components/amount-field'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { Customer } from '@/features/customer/types'
import { PRODUCT_UNITS, type Product } from '@/features/product/types'
import { useCurrencyLabel } from '@/features/settings/components/settings-provider'
import { cn } from '@/lib/utils'
import { api } from '@/server/orpc/client'
import { INVOICE_TYPE, type InvoiceDetail, type InvoiceType } from '../types'
import { numberFormatter } from '../utils/format'
import {
  type InvoiceFormValues,
  invoiceFormSchema,
} from '../utils/invoice-schema'

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

const formatNumeric = (value: number) =>
  value ? value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : ''

const formatLive = (str: string) => {
  const [intPart, fracPart] = str.split('.')
  const grouped = intPart
    ? Number.parseInt(intPart, 10).toLocaleString('en-US')
    : ''
  return fracPart === undefined ? grouped : `${grouped}.${fracPart}`
}

const money = (value: number) => numberFormatter.format(value)

const SHEET_ORDER = [
  'product',
  'name',
  'unit',
  'qty',
  'price',
  'discount',
] as const
type SheetField = (typeof SHEET_ORDER)[number]

const itemCellId = (index: number, field: SheetField) =>
  `invoice-item-${index}-${field}`

const ITEM_GRID =
  'lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1.05fr)_minmax(4.5rem,0.7fr)_minmax(4.75rem,0.75fr)_minmax(6rem,1fr)_minmax(6rem,1fr)_minmax(5.5rem,0.9fr)_2rem]'

function NumericCell({
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
  const currencyLabel = useCurrencyLabel()
  const formRef = useRef<HTMLFormElement>(null)

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

  const focusSheetCell = (index: number, field: SheetField) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(itemCellId(index, field))
      if (!el) return
      el.focus({ preventScroll: true })
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })
  }

  const handleSheetAdvance = (index: number, field: SheetField) => {
    const pos = SHEET_ORDER.indexOf(field)
    if (pos === -1 || pos === SHEET_ORDER.length - 1) {
      focusSheetCell(index + 1, 'product')
      return
    }
    focusSheetCell(index, SHEET_ORDER[pos + 1])
  }

  const handleSheetEnter = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    field: SheetField
  ) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    const pos = SHEET_ORDER.indexOf(field)
    if (event.shiftKey) {
      if (pos <= 0) return
      focusSheetCell(index, SHEET_ORDER[pos - 1])
      return
    }
    handleSheetAdvance(index, field)
  }

  const isLastIndex = (index: number) => index === items.length - 1

  const appendTrailingBlankRow = (index: number) => {
    if (isLastIndex(index)) append(emptyItem)
  }

  const hasTrailingBlankRow = () => {
    const last = items?.[items.length - 1]
    return Boolean(last && !last.productId && !last.name?.trim())
  }

  function handleAddRow() {
    if (hasTrailingBlankRow()) {
      focusSheetCell(items.length - 1, 'product')
      return
    }
    append(emptyItem)
    focusSheetCell(items.length, 'product')
  }

  function handleProductChange(itemIndex: number, productId: string | null) {
    setValue(`items.${itemIndex}.productId`, productId)
    const product = products.find((item) => item.id === productId)
    if (product) {
      setValue(`items.${itemIndex}.name`, product.name)
      setValue(`items.${itemIndex}.unit`, PRODUCT_UNITS[product.unit].label)
      setValue(`items.${itemIndex}.unitPrice`, product.basePrice)
      appendTrailingBlankRow(itemIndex)
      focusSheetCell(itemIndex, 'qty')
    }
  }

  function handleNameChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) {
    onChange(event)
    const value = event.target.value
    if (value.trim() && !items?.[index]?.unit?.trim()) {
      setValue(`items.${index}.unit`, 'عدد')
    }
    appendTrailingBlankRow(index)
  }

  function handleRemove(index: number) {
    remove(index)
    requestAnimationFrame(() => {
      focusSheetCell(Math.max(index - 1, 0), 'product')
    })
  }

  async function onSubmit(values: InvoiceFormValues) {
    const items = values.items
      .filter((item) => item.productId || (item.name?.trim() ?? '') !== '')
      .map((item) => ({
        productId: item.productId ?? null,
        name: item.name?.trim() ?? '',
        unit: item.unit?.trim() ?? '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
      }))
    const payload = { ...values, items }
    try {
      if (invoice) {
        await api.invoices.update({ id: invoice.id, ...payload })
        toast.success('فاکتور با موفقیت ویرایش شد.')
      } else {
        await api.invoices.create(payload)
        toast.success('فاکتور جدید با موفقیت ثبت شد.')
      }
      router.push('/dashboard/invoices')
      router.refresh()
    } catch (error) {
      if (error instanceof ORPCError && error.code === 'NOT_FOUND') {
        toast.error('این فاکتور یافت نشد.')
      } else {
        toast.error('ثبت فاکتور ناموفق بود. دوباره تلاش کنید.')
      }
    }
  }

  const onInvalidSubmit = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(
        '[aria-invalid="true"], [role="alert"]'
      )
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.focus({ preventScroll: true })
        return
      }
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const lineTotal = (index: number) =>
    Math.max(
      0,
      (items?.[index]?.quantity || 0) * (items?.[index]?.unitPrice || 0) -
        (items?.[index]?.discount || 0)
    )

  const singleRow = fields.length === 1

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Tabs value={field.value} onValueChange={field.onChange}>
              <TabsList>
                {(Object.keys(INVOICE_TYPE) as InvoiceType[]).map((type) => (
                  <TabsTrigger key={type} value={type} className="gap-1.5">
                    {type === 'proforma' ? <FileText /> : <ReceiptText />}
                    {INVOICE_TYPE[type].label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        />
      </div>

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
                  onValueChange={(customer) =>
                    field.onChange(customer?.id ?? '')
                  }
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
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-medium">
                              {customer.name}
                            </span>
                            {(customer.mobile || customer.phone) && (
                              <span
                                className="text-muted-foreground text-xs"
                                dir="ltr"
                              >
                                {customer.mobile || customer.phone}
                              </span>
                            )}
                          </div>
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

      <div className="space-y-3 rounded-lg border bg-card/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-bold">اقلام فاکتور</h2>
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs tabular-nums">
              {fields.length}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRow}
          >
            <Plus />
            افزودن ردیف
          </Button>
        </div>

        <p className="text-muted-foreground text-sm">
          با انتخاب کالا از لیست، نام، واحد و قیمت به‌صورت خودکار پر می‌شود؛ با
          Enter به سلول بعدی بروید.
        </p>

        {errors.items?.root?.message ? (
          <p className="text-destructive text-sm">
            {errors.items.root.message}
          </p>
        ) : null}

        <div
          className={cn(
            'hidden items-center pb-1 font-medium text-muted-foreground text-xs lg:grid',
            ITEM_GRID,
            'lg:gap-4'
          )}
        >
          <h3 className="col-span-2">کالا / نام</h3>
          <h3>واحد</h3>
          <h3 className="text-center">تعداد</h3>
          <h3>قیمت واحد</h3>
          <h3>تخفیف</h3>
          <h3 className="text-end">جمع ردیف</h3>
          <span />
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={cn(
                'grid grid-cols-1 gap-3 rounded-lg border bg-background p-3',
                ITEM_GRID,
                'lg:items-center lg:gap-4'
              )}
            >
              <div className="flex items-center justify-between lg:hidden">
                <span className="font-medium text-muted-foreground text-xs">
                  ردیف {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  disabled={singleRow}
                  onClick={() => handleRemove(index)}
                  aria-label={`حذف ردیف ${index + 1}`}
                >
                  <Trash2 />
                </Button>
              </div>

              <Field className="min-w-0">
                <FieldLabel className="lg:hidden">کالا یا خدمت</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={`items.${index}.productId`}
                    render={({ field: productField }) => (
                      <Combobox
                        items={products}
                        itemToStringLabel={(product) => product.name}
                        itemToStringValue={(product) => product.id}
                        value={
                          products.find(
                            (product) => product.id === productField.value
                          ) ?? null
                        }
                        onValueChange={(product) =>
                          handleProductChange(
                            index,
                            product ? product.id : null
                          )
                        }
                      >
                        <ComboboxInput
                          id={itemCellId(index, 'product')}
                          placeholder="انتخاب کالا یا خدمت..."
                          aria-invalid={!!errors.items?.[index]?.name}
                          showClear={false}
                          onBlur={productField.onBlur}
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>کالایی یافت نشد.</ComboboxEmpty>
                          <ComboboxList>
                            {(product: Product) => (
                              <ComboboxItem key={product.id} value={product}>
                                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                                  <span className="truncate">
                                    {product.name}
                                  </span>
                                  <span
                                    className="shrink-0 text-muted-foreground text-xs tabular-nums"
                                    dir="ltr"
                                  >
                                    {money(product.basePrice)}{' '}
                                    {PRODUCT_UNITS[product.unit].label}
                                  </span>
                                </div>
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    )}
                  />
                  <FieldError>
                    {errors.items?.[index]?.name?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field className="min-w-0">
                <FieldLabel className="lg:hidden">نام</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={`items.${index}.name`}
                    render={({ field: nameField }) => (
                      <Input
                        id={itemCellId(index, 'name')}
                        placeholder="نام کالا یا خدمات"
                        aria-invalid={!!errors.items?.[index]?.name}
                        value={nameField.value ?? ''}
                        onChange={(event) =>
                          handleNameChange(index, event, nameField.onChange)
                        }
                        onBlur={nameField.onBlur}
                        onKeyDown={(event) =>
                          handleSheetEnter(event, index, 'name')
                        }
                      />
                    )}
                  />
                  <FieldError>
                    {errors.items?.[index]?.name?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field className="min-w-0">
                <FieldLabel className="lg:hidden">واحد</FieldLabel>
                <FieldContent>
                  <Input
                    {...register(`items.${index}.unit`)}
                    id={itemCellId(index, 'unit')}
                    placeholder="عدد"
                    aria-invalid={!!errors.items?.[index]?.unit}
                    onKeyDown={(event) =>
                      handleSheetEnter(event, index, 'unit')
                    }
                  />
                  <FieldError>
                    {errors.items?.[index]?.unit?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field className="min-w-0">
                <FieldLabel className="lg:hidden">تعداد</FieldLabel>
                <FieldContent>
                  <NumericCell
                    id={itemCellId(index, 'qty')}
                    value={items?.[index]?.quantity ?? 0}
                    placeholder="1"
                    onValueChange={(value) =>
                      setValue(`items.${index}.quantity`, value)
                    }
                    onEnter={() => handleSheetAdvance(index, 'qty')}
                  />
                  <FieldError>
                    {errors.items?.[index]?.quantity?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field className="min-w-0">
                <FieldLabel className="lg:hidden">قیمت واحد</FieldLabel>
                <FieldContent>
                  <NumericCell
                    id={itemCellId(index, 'price')}
                    value={items?.[index]?.unitPrice ?? 0}
                    onValueChange={(value) =>
                      setValue(`items.${index}.unitPrice`, value)
                    }
                    onEnter={() => handleSheetAdvance(index, 'price')}
                  />
                  <FieldError>
                    {errors.items?.[index]?.unitPrice?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <Field className="min-w-0">
                <FieldLabel className="lg:hidden">تخفیف</FieldLabel>
                <FieldContent>
                  <NumericCell
                    id={itemCellId(index, 'discount')}
                    value={items?.[index]?.discount ?? 0}
                    onValueChange={(value) =>
                      setValue(`items.${index}.discount`, value)
                    }
                    onEnter={() => handleSheetAdvance(index, 'discount')}
                  />
                  <FieldError>
                    {errors.items?.[index]?.discount?.message}
                  </FieldError>
                </FieldContent>
              </Field>

              <div className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5 lg:flex-col lg:justify-center lg:gap-0.5 lg:bg-transparent lg:px-0 lg:py-0">
                <span className="text-muted-foreground text-xs lg:hidden">
                  جمع ردیف
                </span>
                <span className="font-medium text-sm tabular-nums lg:text-end">
                  {lineTotal(index) > 0 ? money(lineTotal(index)) : '—'}
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="hidden text-muted-foreground lg:inline-flex lg:self-center"
                disabled={singleRow}
                onClick={() => handleRemove(index)}
                aria-label={`حذف ردیف ${index + 1}`}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
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

      <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-xl border bg-background/90 p-3 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/75 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-muted-foreground text-sm">جمع کل</h2>
            <span className="font-black text-lg tabular-nums">
              {money(totals.total)}
            </span>
            <span className="text-muted-foreground text-xs">
              {currencyLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-muted-foreground text-xs">
            <span>جمع کالاها: {money(totals.subtotal)}</span>
            <span>تخفیف: {money(discount)}</span>
            <span>
              مالیات ({money(taxRate)}٪): {money(totals.tax)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            nativeButton={false}
            disabled={isSubmitting}
            render={<Link href="/dashboard/invoices" />}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            className="flex-1 sm:flex-none"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? invoice
                ? 'در حال ثبت تغییرات…'
                : 'در حال ثبت…'
              : invoice
                ? 'ثبت تغییرات'
                : 'ثبت فاکتور'}
          </Button>
        </div>
      </div>
    </form>
  )
}
