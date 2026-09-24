'use client'

import { FileText, ReceiptText } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { INVOICE_TYPE, type InvoiceType } from '../../types'
import type { InvoiceFormValues } from '../../utils/invoice-schema'

export function InvoiceTypeTabs() {
  const { control } = useFormContext<InvoiceFormValues>()

  return (
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
  )
}
