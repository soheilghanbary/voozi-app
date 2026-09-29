'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signIn, useSession } from '@/lib/auth-client'

export const OAuthButton = () => {
  const { data } = useSession()

  if (data) {
    return (
      <Button nativeButton={false} render={<Link href="/dashboard" />}>
        ورود به پیشخوان
      </Button>
    )
  }

  return (
    <Button
      onClick={() =>
        signIn.social({ provider: 'google', callbackURL: '/dashboard' })
      }
    >
      شروع کنید
    </Button>
  )
}
