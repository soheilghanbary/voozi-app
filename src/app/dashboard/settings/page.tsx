import { call } from '@orpc/server'
import { Banknote, Building2, Palette } from 'lucide-react'
import { Suspense } from 'react'
import { PageHeader } from '@/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getBusinessProfile } from '@/features/settings/api/queries'
import { BusinessProfileForm } from '@/features/settings/components/business-profile-form'
import { CurrencyForm } from '@/features/settings/components/currency-form'
import { InvoiceColorForm } from '@/features/settings/components/invoice-color-form'
import type { BusinessProfile } from '@/features/settings/types'

export const metadata = {
  title: 'تنظیمات',
}

type ProfilePromise = Promise<BusinessProfile>

function SettingsCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="space-y-2 p-6">
        <div className="flex items-start gap-3">
          <div className="size-9 animate-pulse rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            <div className="h-3 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="space-y-3 pt-4">
          <div className="h-9 animate-pulse rounded-md bg-muted/60" />
          <div className="h-9 animate-pulse rounded-md bg-muted/60" />
          <div className="h-24 animate-pulse rounded-md bg-muted/60" />
        </div>
      </div>
    </div>
  )
}

async function BusinessProfileCard({ profile }: { profile: ProfilePromise }) {
  const profileData = await profile

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-4.5" />
          </div>
          <div>
            <CardTitle>پروفایل کسب‌وکار</CardTitle>
            <CardDescription>
              لوگو، نام و امضای شما روی فاکتورهای صادر شده نمایش داده می‌شود.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <BusinessProfileForm profile={profileData} />
      </CardContent>
    </Card>
  )
}

async function CurrencyCard({ profile }: { profile: ProfilePromise }) {
  const profileData = await profile

  return (
    <Card className="xl:h-fit">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Banknote className="size-4.5" />
          </div>
          <div>
            <CardTitle>واحد پول</CardTitle>
            <CardDescription>
              واحد پول پیش‌فرض برای نمایش قیمت‌ها و مبالغ فاکتورها.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CurrencyForm currency={profileData.currency} />
      </CardContent>
    </Card>
  )
}

async function InvoiceColorCard({ profile }: { profile: ProfilePromise }) {
  const profileData = await profile

  return (
    <Card className="xl:h-fit">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Palette className="size-4.5" />
          </div>
          <div>
            <CardTitle>رنگ فاکتور</CardTitle>
            <CardDescription>
              رنگ پیش‌فرض برای ظاهر فاکتور در پیش‌نمایش و چاپ.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <InvoiceColorForm invoiceColor={profileData.invoiceColor} />
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const profile = Promise.resolve(call(getBusinessProfile))

  return (
    <div className="space-y-4">
      <PageHeader
        backHref="/dashboard"
        backLabel="بازگشت به داشبورد"
        title="تنظیمات"
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Suspense fallback={<SettingsCardSkeleton />}>
          <BusinessProfileCard profile={profile} />
        </Suspense>
        <Suspense fallback={<SettingsCardSkeleton />}>
          <CurrencyCard profile={profile} />
        </Suspense>
        <Suspense fallback={<SettingsCardSkeleton />}>
          <InvoiceColorCard profile={profile} />
        </Suspense>
      </div>
    </div>
  )
}
