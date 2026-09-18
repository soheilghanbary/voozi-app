'use client'

import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserPlusIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { signIn, signOut, useSession } from '@/lib/auth-client'

function userInitials(name: string | null | undefined, email?: string) {
  const source = (name ?? email ?? '').trim()
  if (!source) return '?'
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
}

export function NavUser() {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { data: session } = useSession()
  const user = session?.user ?? null

  const initials = useMemo(
    () => userInitials(user?.name, user?.email),
    [user?.name, user?.email]
  )

  async function handleAddAccount() {
    await signIn.social({ provider: 'google', callbackURL: '/dashboard' })
  }

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            {user ? (
              <>
                <Avatar>
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name ?? ''} />
                  ) : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name ?? 'کاربر'}
                  </span>
                  {user.email && (
                    <span className="truncate text-xs">{user.email}</span>
                  )}
                </div>
                <ChevronsUpDownIcon className="ms-auto size-4" />
              </>
            ) : (
              <div className="grid w-full place-items-center gap-1.5 py-1 font-medium text-muted-foreground text-xs">
                ورود به حساب
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {user ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                      <Avatar>
                        {user.image ? (
                          <AvatarImage src={user.image} alt={user.name ?? ''} />
                        ) : null}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-start text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user.name ?? 'کاربر'}
                        </span>
                        {user.email && (
                          <span className="truncate text-xs">{user.email}</span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-medium text-xs">
                    حساب‌ها
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    className="text-start"
                    onClick={handleAddAccount}
                  >
                    <UserPlusIcon />
                    افزودن حساب
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    nativeButton={false}
                    render={<Link href="/dashboard/settings" />}
                  >
                    <SettingsIcon />
                    تنظیمات
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleSignOut}
                  >
                    <LogOutIcon />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-start"
                  onClick={handleAddAccount}
                >
                  <UserPlusIcon />
                  ورود به حساب
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
