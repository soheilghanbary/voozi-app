import { OAuthButton } from '@/components/oauth-button'

export default async () => {
  return (
    <section className="flex size-full h-dvh flex-col items-center justify-center gap-4">
      <h1>Ready to code</h1>
      <OAuthButton />
    </section>
  )
}
