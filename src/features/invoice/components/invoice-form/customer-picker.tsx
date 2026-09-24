'use client'

import { ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import type { Customer } from '@/features/customer/types'
import { CUSTOMER_TYPE } from '@/features/customer/types'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

type CustomerPickerProps = {
  customers: Customer[]
  value: string
  onChange: (customerId: string) => void
  invalid?: boolean
  placeholder?: string
}

export function CustomerPicker({
  customers,
  value,
  onChange,
  invalid,
  placeholder = 'انتخاب مشتری',
}: CustomerPickerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const selectedCustomer = customers.find((customer) => customer.id === value)

  const handleSelect = (customer: Customer) => {
    onChange(customer.id)
    setOpen(false)
  }

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-invalid={invalid}
      className={cn(
        'flex h-9.5 w-full min-w-0 items-center gap-2 rounded-md border bg-card px-2.5 text-start text-base outline-none transition-all duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm',
        'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
        selectedCustomer ? 'text-foreground' : 'text-muted-foreground/65'
      )}
    >
      <span className="min-w-0 flex-1 truncate">
        {selectedCustomer?.name ?? placeholder}
      </span>
      <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
    </button>
  )

  const renderPicker = (listClassName?: string) => (
    <Command>
      <CommandInput placeholder="جستجوی مشتری..." />
      <CommandList className={cn(listClassName, 'mt-4')}>
        <CommandEmpty>مشتری‌ای یافت نشد.</CommandEmpty>
        {customers.map((customer) => (
          <CommandItem
            key={customer.id}
            value={customer.name}
            keywords={[customer.mobile]}
            data-checked={selectedCustomer?.id === customer.id}
            onSelect={() => handleSelect(customer)}
          >
            <span className="truncate font-medium">{customer.name}</span>
            <span className="text-muted-foreground text-xs">
              {CUSTOMER_TYPE[customer.customerType].label}
            </span>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )

  return (
    <>
      {trigger}
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
          <DrawerContent>
            <DrawerHeader className="text-start">
              <DrawerTitle>انتخاب مشتری</DrawerTitle>
              <DrawerDescription>
                جستجو در نام یا شماره تماس مشتریان
              </DrawerDescription>
            </DrawerHeader>
            <div className="h-[55dvh] min-h-64 overflow-hidden px-2 pt-2 pb-4">
              {renderPicker('max-h-none min-h-0 flex-1')}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <CommandDialog
          title="انتخاب مشتری"
          description="جستجو در نام یا شماره تماس مشتریان"
          open={open}
          onOpenChange={setOpen}
        >
          {renderPicker()}
        </CommandDialog>
      )}
    </>
  )
}
