'use client'

import {
  AudioLinesIcon,
  GalleryVerticalEndIcon,
  TerminalIcon,
} from 'lucide-react'
import type * as React from 'react'
import { Box2, ChartPie, Gear, Invoice, Users2 } from 'reicon-react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

export const menus = [
  {
    href: '/',
    title: 'پیشخوان',
    icon: <ChartPie />,
  },
  {
    href: '/invoices',
    title: 'فاکتور ها',
    icon: <Invoice />,
  },
  {
    href: '/customers',
    title: 'مشتریان',
    icon: <Users2 />,
  },
  {
    href: '/products',
    title: 'محصولات',
    icon: <Box2 />,
  },
  {
    href: '/settings',
    title: 'تنظیمات',
    icon: <Gear />,
  },
]

// This is sample data.
const data = {
  user: {
    name: 'Soheil',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: <GalleryVerticalEndIcon />,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: <AudioLinesIcon />,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: <TerminalIcon />,
      plan: 'Free',
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menus} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
