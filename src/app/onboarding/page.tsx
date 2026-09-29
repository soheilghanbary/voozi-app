import { call } from '@orpc/server'
import { ReceiptText } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getBusinessProfile } from '@/features/settings/api/queries'
import { OnboardingWizard } from '@/features/settings/components/onboarding-wizard'
import type { BusinessProfile } from '@/features/settings/types'

export const instant = false

export default async function Page() {
  let profile: BusinessProfile | null = null
  try {
    profile = await call(getBusinessProfile)
  } catch {
    redirect('/')
  }

  if (profile?.completed) {
    redirect('/dashboard')
  }

  if (!profile) {
    redirect('/')
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ReceiptText className="size-4.5" />
          </span>
          <span className="font-black text-lg tracking-tight">ووزی</span>
        </div>
        <OnboardingWizard profile={profile} />
      </div>
    </div>
  )
}
