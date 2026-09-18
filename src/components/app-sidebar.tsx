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
  useSidebar,
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
  const { state } = useSidebar()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <Logo
            className={cn(
              'size-6 text-primary transition-[width,height] duration-200 ease-linear',
              state === 'collapsed' && 'size-5'
            )}
          />
          <p
            className={cn(
              'font-black text-base/6',
              state === 'collapsed' && 'hidden'
            )}
          >
            وزیا
          </p>
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
