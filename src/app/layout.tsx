import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import type { PropsWithChildren } from 'react'
import { font } from '@/assets/font'
import Providers from '@/components/providers'
import { appConfig } from '@/config'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'light',
  themeColor: 'var(--primary)',
}

export const metadata: Metadata = {
  title: {
    default: appConfig.title,
    template: `%s - ${appConfig.title}`,
  },
  description: appConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
