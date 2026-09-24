'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ORPCError } from '@orpc/client'
import { useRouter } from 'next/navigation'
import { useMemo, useRef } from 'react'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form'
import { toast } from 'sonner'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { Customer } from '@/features/customer/types'
import { PRODUCT_UNITS, type Product } from '@/features/product/types'
import { useCurrencyLabel } from '@/features/settings/components/settings-provider'
import { api } from '@/server/orpc/client'
import type { InvoiceDetail } from '../../types'
import {
  type InvoiceFormValues,
  invoiceFormSchema,
} from '../../utils/invoice-schema'
import { CustomerFields } from './customer-fields'
import { FormFooter } from './form-footer'
import { ItemsEditor } from './items-editor'
import { computeTotals, emptyForm, toFormValues } from './lib'
import { InvoiceTypeTabs } from './type-tabs'

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

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: invoice ? toFormValues(invoice) : emptyForm,
  })

  const { control, handleSubmit } = form
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
    const preparedItems = values.items
      .filter((item) => item.productId || (item.name?.trim() ?? '') !== '')
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          productId: item.productId ?? null,
          name: item.name?.trim() ?? '',
          unit:
            (product ? PRODUCT_UNITS[product.unit].label : null) ??
            item.unit?.trim() ??
            'عدد',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
        }
      })
    const payload = { ...values, items: preparedItems }
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

  const { isSubmitting, errors } = form.formState

  return (
    <FormProvider {...form}>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        className="space-y-6"
      >
        <fieldset disabled={isSubmitting} className="space-y-6">
          <InvoiceTypeTabs />
          <CustomerFields customers={customers} currencyLabel={currencyLabel} />
          <ItemsEditor
            fields={fields}
            append={append}
            remove={remove}
            items={items ?? []}
            products={products}
          />

          <Field>
            <FieldLabel>
              یادداشت <span className="text-muted-foreground">(اختیاری)</span>
            </FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="یادداشت روی فاکتور..."
                aria-invalid={!!errors.note}
                {...form.register('note')}
              />
              <FieldError>{errors.note?.message}</FieldError>
            </FieldContent>
          </Field>

          <Controller
            control={control}
            name="signature"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4 rounded-lg border bg-card/60 p-4">
                <div className="space-y-0.5">
                  <p className="font-medium text-sm">نمایش امضا روی سند</p>
                  <p className="text-muted-foreground text-xs">
                    امضای فروشنده در پیش‌نمایش و پرینت نمایش داده شود
                  </p>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="نمایش امضا روی سند"
                />
              </div>
            )}
          />
        </fieldset>

        <FormFooter
          totals={totals}
          discount={discount}
          taxRate={taxRate}
          isSubmitting={isSubmitting}
          isEdit={!!invoice}
        />
      </form>
    </FormProvider>
  )
}
