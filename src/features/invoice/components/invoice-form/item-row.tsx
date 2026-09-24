'use client'

import { Trash2 } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
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
import type { Product } from '@/features/product/types'
import { PRODUCT_UNITS } from '@/features/product/types'
import { useCurrencyLabel } from '@/features/settings/components/settings-provider'
import { cn } from '@/lib/utils'
import type { InvoiceFormValues } from '../../utils/invoice-schema'
import {
  advanceSheetCell,
  handleSheetEnter,
  ITEM_GRID,
  itemCellId,
  money,
} from './lib'
import { NumericCell } from './numeric-cell'

type ItemRowProps = {
  index: number
  items: InvoiceFormValues['items']
  products: Product[]
  singleRow: boolean
  onProductChange: (index: number, productId: string | null) => void
  onNameChange: (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
  ) => void
  onRemove: (index: number) => void
}

export function ItemRow({
  index,
  items,
  products,
  singleRow,
  onProductChange,
  onNameChange,
  onRemove,
}: ItemRowProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>()
  const currencyLabel = useCurrencyLabel()

  const lineTotal = Math.max(
    0,
    (items?.[index]?.quantity || 0) * (items?.[index]?.unitPrice || 0) -
      (items?.[index]?.discount || 0)
  )

  return (
    <div
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
          onClick={() => onRemove(index)}
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
            render={({ field: productField }) => {
              const selectedProduct = products.find(
                (product) => product.id === productField.value
              )
              return (
                <Combobox
                  items={products}
                  itemToStringLabel={(product) => product.name}
                  itemToStringValue={(product) => product.id}
                  value={selectedProduct ?? null}
                  onValueChange={(product) =>
                    onProductChange(index, product ? product.id : null)
                  }
                >
                  <ComboboxInput
                    id={itemCellId(index, 'product')}
                    placeholder="انتخاب کالا یا خدمت..."
                    aria-invalid={!!errors.items?.[index]?.name}
                    onBlur={productField.onBlur}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>کالایی یافت نشد.</ComboboxEmpty>
                    <ComboboxList>
                      {(product: Product) => (
                        <ComboboxItem key={product.id} value={product}>
                          {product.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                  {selectedProduct ? (
                    <p
                      className="flex items-center gap-1.5 text-muted-foreground text-xs lg:hidden"
                      role="note"
                    >
                      <span className="rounded-full bg-muted px-2 py-0.5">
                        {PRODUCT_UNITS[selectedProduct.unit].label}
                      </span>
                      <span className="tabular-nums">
                        قیمت پایه: {money(selectedProduct.basePrice)}{' '}
                        {currencyLabel}
                      </span>
                    </p>
                  ) : null}
                </Combobox>
              )
            }}
          />
          <FieldError>{errors.items?.[index]?.name?.message}</FieldError>
        </FieldContent>
      </Field>

      <Field className="min-w-0">
        <FieldLabel className="lg:hidden">نام کالا</FieldLabel>
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
                  onNameChange(index, event, nameField.onChange)
                }
                onBlur={nameField.onBlur}
                onKeyDown={(event) => handleSheetEnter(event, index, 'name')}
              />
            )}
          />
          <FieldError>{errors.items?.[index]?.name?.message}</FieldError>
        </FieldContent>
      </Field>

      <div className="grid grid-cols-2 gap-3 lg:contents">
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
              onEnter={() => advanceSheetCell(index, 'qty')}
            />
            <FieldError>{errors.items?.[index]?.quantity?.message}</FieldError>
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
              onEnter={() => advanceSheetCell(index, 'price')}
            />
            <FieldError>{errors.items?.[index]?.unitPrice?.message}</FieldError>
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:contents">
        <Field className="min-w-0">
          <FieldLabel className="lg:hidden">تخفیف</FieldLabel>
          <FieldContent>
            <NumericCell
              id={itemCellId(index, 'discount')}
              value={items?.[index]?.discount ?? 0}
              onValueChange={(value) =>
                setValue(`items.${index}.discount`, value)
              }
              onEnter={() => advanceSheetCell(index, 'discount')}
            />
            <FieldError>{errors.items?.[index]?.discount?.message}</FieldError>
          </FieldContent>
        </Field>

        <div className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5 lg:flex-col lg:justify-center lg:gap-0.5 lg:bg-transparent lg:px-0 lg:py-0">
          <span className="text-muted-foreground text-xs lg:hidden">
            جمع ردیف
          </span>
          <span className="font-medium text-sm tabular-nums lg:text-end">
            {lineTotal > 0 ? money(lineTotal) : '—'}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="hidden text-muted-foreground lg:inline-flex lg:self-center"
        disabled={singleRow}
        onClick={() => onRemove(index)}
        aria-label={`حذف ردیف ${index + 1}`}
      >
        <Trash2 />
      </Button>
    </div>
  )
}
