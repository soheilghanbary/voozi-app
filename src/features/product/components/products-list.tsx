'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  SearchIcon,
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
import type { ProductSort } from '../hooks/use-product-list'
import { useProductList } from '../hooks/use-product-list'
import { ProductCard } from './product-card'
import { ProductFormDialog } from './product-form-dialog'

const PAGE_SIZES = [12, 24, 36, 60]

const SORT_LABELS: Record<ProductSort, string> = {
  newest: 'جدیدترین',
  oldest: 'قدیمی‌ترین',
  name: 'بر اساس نام',
  priceAsc: 'قیمت: کم به زیاد',
  priceDesc: 'قیمت: زیاد به کم',
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed p-14 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
        <Package className="size-6" />
      </div>
      <h3 className="mt-4 font-bold text-lg">
        هنوز محصول یا خدمتی ثبت نشده است
      </h3>
      <p className="mt-1 text-muted-foreground text-sm">
        اولین محصول یا خدمت خود را اضافه کنید.
      </p>
      <div className="mt-6 flex justify-center">
        <ProductFormDialog
          trigger={
            <Button>
              <Package />
              محصول جدید
            </Button>
          }
        />
      </div>
    </div>
  )
}

export function ProductsList() {
  const { data: products } = useSuspenseQuery(
    client.products.list.queryOptions()
  )
  const list = useProductList(products)

  if (!products.length) {
    return <EmptyState />
  }

  const from = list.pageIndex * list.pageSize + 1
  const to = Math.min(from + list.pageSize - 1, list.totalCount)
  const hasResults = list.products.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full min-w-0 max-w-sm">
          <SearchIcon className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجو در نام محصول یا خدمات…"
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
        <span className="text-muted-foreground text-sm">
          {list.totalCount.toLocaleString('fa-IR')} محصول
        </span>
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <Select
            value={list.sort}
            onValueChange={(value) =>
              list.handleSortChange(value as ProductSort)
            }
          >
            <SelectTrigger
              size="sm"
              className="w-fit"
              aria-label="مرتب‌سازی محصولات"
            >
              <SelectValue placeholder="مرتب‌سازی">
                {SORT_LABELS[list.sort]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
              <SelectItem value="name">بر اساس نام</SelectItem>
              <SelectItem value="priceAsc">قیمت: کم به زیاد</SelectItem>
              <SelectItem value="priceDesc">قیمت: زیاد به کم</SelectItem>
            </SelectContent>
          </Select>
          <ProductFormDialog trigger={<Button>محصول جدید</Button>} />
        </div>
      </div>

      {hasResults ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {list.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-14 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <SearchIcon className="size-6" />
          </div>
          <h3 className="mt-4 font-bold text-lg">
            محصولی با این مشخصات پیدا نشد
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
              <SelectTrigger size="sm" className="h-8 w-[70px]">
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
            از {list.totalCount.toLocaleString('fa-IR')} محصول
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
