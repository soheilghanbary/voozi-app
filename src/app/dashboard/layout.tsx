import { AppSidebar } from '@/components/app-sidebar'
import { NavHeader } from '@/components/nav-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar side="right" variant="floating" />
      <SidebarInset className="min-w-0">
        <NavHeader />
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
