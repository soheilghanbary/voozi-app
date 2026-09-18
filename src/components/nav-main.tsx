'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

type Props = {
  items: {
    title: string
    href: string
    icon: any
  }[]
}

export function NavMain({ items }: Props) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              size={'md'}
              isActive={pathname === item.href}
              tooltip={item.title}
              onClick={() => {
                if (isMobile) setOpenMobile(false)
              }}
              render={<Link href={item.href} />}
            >
              {item.icon}
              {item.title}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
