'use client'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { PropsWithChildren } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from './query-provider'
import { ToastProvider } from './toast-provider'

export default function Providers({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <ThemeProvider attribute="class" enableColorScheme defaultTheme="light">
          <TooltipProvider>{children}</TooltipProvider>
          <ToastProvider />
        </ThemeProvider>
      </QueryProvider>
    </NuqsAdapter>
  )
}
