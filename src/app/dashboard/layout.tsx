import { call } from '@orpc/server'
import { AppSidebar } from '@/components/app-sidebar'
import { NavHeader } from '@/components/nav-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getBusinessProfile } from '@/features/settings/api/queries'
import { SettingsProvider } from '@/features/settings/components/settings-provider'

export const instant = false

export default async function DashboardLayout({
  children,
}: React.PropsWithChildren) {
  const profile = await call(getBusinessProfile)

  return (
    <SettingsProvider currency={profile.currency}>
      <SidebarProvider>
        <AppSidebar side="right" variant="floating" />
        <SidebarInset className="min-w-0">
          <NavHeader />
          <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SettingsProvider>
  )
}
