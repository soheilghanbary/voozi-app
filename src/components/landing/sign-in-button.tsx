'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { signIn, useSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const skeletonSize = {
  default: 'h-9 w-28',
  sm: 'h-8 w-24',
  lg: 'h-11 w-32',
  icon: 'size-10',
}

export function SignInButton({
  className,
  label = 'شروع کنید',
  size = 'default',
  variant = 'default',
}: {
  className?: string
  label?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}) {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <Skeleton className={cn(skeletonSize[size], className)} />
  }

  if (session) {
    return (
      <Button
        className={cn(className)}
        size={size}
        variant={variant}
        nativeButton={false}
        render={<Link href="/dashboard" />}
      >
        {label}
      </Button>
    )
  }

  return (
    <Button
      className={cn(className)}
      size={size}
      variant={variant}
      onClick={() =>
        signIn.social({ provider: 'google', callbackURL: '/dashboard' })
      }
    >
      {label}
    </Button>
  )
}
