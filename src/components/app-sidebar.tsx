'use client'

import type * as React from 'react'
import { Box2, ChartPie, Gear, Invoice, Users2 } from 'reicon-react'
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
    href: '/dashboard/settings',
    title: 'تنظیمات',
    icon: <Gear />,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 pb-2">
        <Logo className="text-primary" />
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
