'use client'

import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

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
