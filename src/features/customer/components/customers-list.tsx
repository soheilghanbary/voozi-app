'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchIcon,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { client } from '@/server/orpc/client'
import type { CustomerSort } from '../hooks/use-customer-list'
import { useCustomerList } from '../hooks/use-customer-list'
import { CustomerCard } from './customer-card'
import { CustomerFormDialog } from './customer-form-dialog'

const PAGE_SIZES = [12, 24, 36, 60]

const SORT_LABELS: Record<CustomerSort, string> = {
  newest: 'جدیدترین',
  oldest: 'قدیمی‌ترین',
  name: 'بر اساس نام',
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed p-14 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
        <Users className="size-6" />
      </div>
      <h3 className="mt-4 font-bold text-lg">هنوز مشتری‌ای ثبت نشده است</h3>
      <p className="mt-1 text-muted-foreground text-sm">
        اولین مشتری خود را اضافه کنید.
      </p>
      <div className="mt-6 flex justify-center">
        <CustomerFormDialog
          trigger={
            <Button>
              <Users />
              مشتری جدید
            </Button>
          }
        />
      </div>
    </div>
  )
}

export function CustomersList() {
  const { data: customers } = useSuspenseQuery(
    client.customers.list.queryOptions()
  )
  const list = useCustomerList(customers)

  if (!customers.length) {
    return <EmptyState />
  }

  const from = list.pageIndex * list.pageSize + 1
  const to = Math.min(from + list.pageSize - 1, list.totalCount)
  const hasResults = list.customers.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full min-w-0 max-w-sm">
          <SearchIcon className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجو در نام، شماره تماس…"
            value={list.searchQuery}
            onChange={(event) => list.handleSearch(event.target.value)}
            className="ps-8 pe-8"
          />
          {list.searchQuery ? (
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute inset-e-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="پاک کردن جستجو"
              onClick={() => list.handleSearch('')}
            >
              <X />
            </Button>
          ) : null}
        </div>
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <Select
            value={list.sort}
            onValueChange={(value) =>
              list.handleSortChange(value as CustomerSort)
            }
          >
            <SelectTrigger
              size="sm"
              className="w-fit"
              aria-label="مرتب‌سازی مشتریان"
            >
              <SelectValue placeholder="مرتب‌سازی">
                {SORT_LABELS[list.sort]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
              <SelectItem value="name">بر اساس نام</SelectItem>
            </SelectContent>
          </Select>
          <CustomerFormDialog trigger={<Button>مشتری جدید</Button>} />
        </div>
      </div>

      {hasResults ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {list.customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-14 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <SearchIcon className="size-6" />
          </div>
          <h3 className="mt-4 font-bold text-lg">
            مشتری‌ای با این مشخصات پیدا نشد
          </h3>
          <p className="mt-1 text-muted-foreground text-sm">
            عبارت دیگری را جستجو کنید یا جستجو را پاک کنید.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={() => list.handleSearch('')}>
              پاک کردن جستجو
            </Button>
          </div>
        </div>
      )}

      {hasResults && list.pageCount > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">ردیف در صفحه</span>
            <Select
              value={`${list.pageSize}`}
              onValueChange={(value) =>
                list.handlePageSizeChange(Number(value))
              }
            >
              <SelectTrigger size="sm" className="h-8 w-17.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top" align="start">
                {PAGE_SIZES.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="font-medium text-muted-foreground text-sm">
            نمایش {from.toLocaleString('fa-IR')} تا {to.toLocaleString('fa-IR')}{' '}
            از {list.totalCount.toLocaleString('fa-IR')} مشتری
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={list.firstPage}
              disabled={!list.hasPreviousPage}
              aria-label="رفتن به اولین صفحه"
            >
              <ChevronsRight />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={list.previousPage}
              disabled={!list.hasPreviousPage}
              aria-label="رفتن به صفحه قبلی"
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={list.nextPage}
              disabled={!list.hasNextPage}
              aria-label="رفتن به صفحه بعدی"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={list.lastPage}
              disabled={!list.hasNextPage}
              aria-label="رفتن به آخرین صفحه"
            >
              <ChevronsLeft />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
