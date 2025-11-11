'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState('ru')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get current locale from localStorage or default to 'ru'
    const savedLocale = localStorage.getItem('locale') || 'ru'
    setLocale(savedLocale)
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: string) => {
    console.log('Switching locale to:', newLocale)
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    setIsOpen(false)
    // Reload page to apply new locale
    window.location.reload()
  }

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('Language button clicked, current state:', isOpen)
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[#55c4c8] text-[#282a35] font-medium hover:bg-[#34979a] transition-colors"
      >
        {locale.toUpperCase()}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[101]">
          <button
            onClick={() => switchLocale('en')}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
              locale === 'en'
                ? 'bg-[#55c4c8]/15 text-gray-900 font-semibold'
                : 'text-gray-700'
            }`}
            aria-selected={locale === 'en'}
          >
            EN
          </button>
          <button
            onClick={() => switchLocale('ru')}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
              locale === 'ru'
                ? 'bg-[#55c4c8]/15 text-gray-900 font-semibold'
                : 'text-gray-700'
            }`}
            aria-selected={locale === 'ru'}
          >
            RU
          </button>
        </div>
      )}
    </div>
  )
}
