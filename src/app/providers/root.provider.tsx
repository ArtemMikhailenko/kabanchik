'use client'
import { QueryProviders } from '@/app/providers'
import { NextIntlClientProvider } from 'next-intl'
import { useState, useEffect } from 'react'
import enMessages from '@/../messages/en.json'
import ruMessages from '@/../messages/ru.json'

const messagesMap: Record<string, any> = {
  en: enMessages,
  ru: ruMessages,
}

export function RootProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('ru')

  useEffect(() => {
    // Get locale from localStorage or default to 'ru'
    const savedLocale = localStorage.getItem('locale') || 'ru'
    setLocale(savedLocale)
  }, [])

  return (
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
      <QueryProviders>{children}</QueryProviders>
    </NextIntlClientProvider>
  )
}
