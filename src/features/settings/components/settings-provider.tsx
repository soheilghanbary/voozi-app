'use client'

import { createContext, useContext } from 'react'
import { CURRENCY, type Currency } from '@/features/settings/types'

type SettingsContextValue = {
  currency: Currency
  currencyLabel: string
}

const SettingsContext = createContext<SettingsContextValue>({
  currency: 'toman',
  currencyLabel: CURRENCY.toman.label,
})

export function SettingsProvider({
  currency,
  children,
}: {
  currency: Currency
  children: React.ReactNode
}) {
  return (
    <SettingsContext.Provider
      value={{ currency, currencyLabel: CURRENCY[currency].label }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}

export function useCurrencyLabel() {
  return useSettings().currencyLabel
}
