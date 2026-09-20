'use client'

import type * as React from 'react'
import {
  Box2,
  ChartPie,
  Gear,
  Invoice,
  Stickynote,
  Tasks,
  Users2,
} from 'reicon-react'
import { Logo } from '@/assets/logo'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export const menus = [
  {
    href: '/dashboard',
    title: 'پیشخوان',
    icon: <ChartPie />,
  },
  {
    href: '/dashboard/invoices',
    title: 'فاکتور ها',
    icon: <Invoice />,
  },
  {
    href: '/dashboard/customers',
    title: 'مشتریان',
    icon: <Users2 />,
  },
  {
    href: '/dashboard/products',
    title: 'محصولات',
    icon: <Box2 />,
  },
  {
    href: '/dashboard/notes',
    title: 'یادداشت‌ها',
    icon: <Stickynote />,
  },
  {
    href: '/dashboard/tasks',
    title: 'وظایف',
    icon: <Tasks />,
  },
  {
    href: '/dashboard/settings',
    title: 'تنظیمات',
    icon: <Gear />,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex items-center justify-between p-4 pb-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-3">
        <div className="flex w-full items-center justify-start text-primary dark:text-foreground">
          <Logo
            className={cn('size-6 transition-all duration-200 ease-linear')}
          />
          <span className="ms-1 font-black text-lg group-data-[collapsible=icon]:hidden">
            VEZIA
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menus} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
