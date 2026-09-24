import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import type { PropsWithChildren } from 'react'
import { font } from '@/assets/font'
import Providers from '@/components/providers'
import { appConfig } from '@/config'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

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
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={cn('font-sans', inter.variable)}
    >
      <body className={`${font.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
