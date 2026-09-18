import { call } from '@orpc/server'
import { ArrowRight, Banknote, Building2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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

export const instant = false

export const metadata = {
  title: 'تنظیمات',
}

export default async function Page() {
  const profile = await call(getBusinessProfile)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/dashboard" />}
          aria-label="بازگشت به داشبورد"
        >
          <ArrowRight />
        </Button>
        <h1 className="font-black text-xl">تنظیمات</h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
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
            <BusinessProfileForm profile={profile} />
          </CardContent>
        </Card>

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
            <CurrencyForm currency={profile.currency} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
