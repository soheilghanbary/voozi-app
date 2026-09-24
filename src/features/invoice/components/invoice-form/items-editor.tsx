'use client'

import { Plus } from 'lucide-react'
import type { ChangeEvent } from 'react'
import {
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form'
import { Button } from '@/components/ui/button'
import type { Product } from '@/features/product/types'
import { PRODUCT_UNITS } from '@/features/product/types'
import { cn } from '@/lib/utils'
import type { InvoiceFormValues } from '../../utils/invoice-schema'
import { ItemRow } from './item-row'
import { emptyItem, focusSheetCell, ITEM_GRID } from './lib'

type ItemsEditorProps = {
  fields: FieldArrayWithId<InvoiceFormValues, 'items', 'id'>[]
  append: UseFieldArrayAppend<InvoiceFormValues, 'items'>
  remove: UseFieldArrayRemove
  items: InvoiceFormValues['items']
  products: Product[]
}

export function ItemsEditor({
  fields,
  append,
  remove,
  items,
  products,
}: ItemsEditorProps) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>()

  const singleRow = fields.length === 1
  const isLastIndex = (index: number) => index === items.length - 1

  const hasTrailingBlankRow = () => {
    const last = items?.[items.length - 1]
    return Boolean(last && !last.productId && !last.name?.trim())
  }

  const appendTrailingBlankRow = (index: number) => {
    if (isLastIndex(index)) append(emptyItem)
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
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
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

  return (
    <div className="space-y-3 rounded-lg border bg-card/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-bold">اقلام فاکتور</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs tabular-nums">
            {fields.length}
          </span>
        </div>
        <Button type="button" variant="secondary" onClick={handleAddRow}>
          <Plus />
          افزودن ردیف
        </Button>
      </div>

      {errors.items?.root?.message ? (
        <p className="text-destructive text-sm">{errors.items.root.message}</p>
      ) : null}

      <div
        className={cn(
          'hidden items-center pb-1 font-medium text-muted-foreground text-xs lg:grid',
          ITEM_GRID,
          'lg:gap-4'
        )}
      >
        <h3 className="col-span-2">کالا / نام</h3>
        <h3 className="text-center">تعداد</h3>
        <h3>قیمت واحد</h3>
        <h3>تخفیف</h3>
        <h3 className="text-end">جمع ردیف</h3>
        <span />
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <ItemRow
            key={field.id}
            index={index}
            items={items}
            products={products}
            singleRow={singleRow}
            onProductChange={handleProductChange}
            onNameChange={handleNameChange}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  )
}
