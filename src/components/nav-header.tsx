'use client'

import { usePathname } from 'next/navigation'
import { Notification3 } from 'reicon-react'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'
import { UserMenu } from './user-menu'

export const NavHeader = () => {
  const pathname = usePathname()
  const isInvoicePreview = /^\/dashboard\/invoices\/[^/]+$/.test(pathname)

  if (isInvoicePreview) {
    return null
  }

  return (
    <header className="mx-2 mt-2 rounded-md border border-border/65 bg-card p-1 shadow-xs">
      <nav className="flex items-center gap-x-2">
        <SidebarTrigger className="ms-1 ml-auto" />
        <ModeToggle />
        <Separator
          orientation="vertical"
          className="data-vertical:h-4 data-vertical:self-auto"
        />
        <Button variant="ghost" size="icon">
          <Notification3 />
        </Button>
        <UserMenu />
      </nav>
    </header>
  )
}
