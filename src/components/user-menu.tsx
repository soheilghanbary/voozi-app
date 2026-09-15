'use client'

import { LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { signOut, useSession } from '@/lib/auth-client'

interface NavUser {
  name?: string | null
  email?: string
  image?: string | null
}

function userInitials(user: NavUser) {
  const source = (user.name ?? user.email ?? '').trim()
  if (!source) return '?'
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
}

export function UserMenu() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user ?? null

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const trigger = (
    <Button
      variant="link"
      className="h-10 gap-2 px-1.5"
      aria-label="منوی کاربر"
    >
      {isPending ? (
        <Skeleton className="size-8 rounded-full" aria-hidden="true" />
      ) : (
        <Avatar>
          {user?.image ? (
            <AvatarImage src={user.image} alt={user.name ?? ''} />
          ) : null}
          <AvatarFallback>{user ? userInitials(user) : '?'}</AvatarFallback>
        </Avatar>
      )}
    </Button>
  )

  if (isPending || !user) return trigger

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block truncate font-medium text-sm">
              {user.name ?? 'کاربر'}
            </span>
            {user.email && (
              <span className="block truncate text-muted-foreground text-xs">
                {user.email}
              </span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          nativeButton={false}
          render={<Link href="/dashboard/settings" />}
        >
          <Settings />
          تنظیمات
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          خروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
