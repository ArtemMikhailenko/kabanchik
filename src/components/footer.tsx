'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

interface Group {
  title: string
  items: { label: string; href: string }[]
}

export default function Footer() {
  const groups: Group[] = [
    {
      title: 'О СЕРВИСЕ',
      items: [
        { label: 'О нас', href: '/about' },
        { label: 'Как это работает', href: '/how-it-works' },
        { label: 'Вопросы и ответы', href: '/faq' },
      ],
    },
    {
      title: 'СООБЩЕСТВО',
      items: [
        { label: 'Для заказчиков', href: '/for-customers' },
        { label: 'Для специалистов', href: '/for-specialists' },
        { label: 'Премиум-аккаунт', href: '/premium' },
      ],
    },
    {
      title: 'ПРАВОВАЯ ИНФОРМАЦИЯ',
      items: [
        { label: 'Правила пользования', href: '/terms' },
        { label: 'Политика конфиденциальности', href: '/privacy' },
        { label: 'Cookies', href: '/cookies' },
        { label: 'Юридическое уведомление', href: '/legal' },
        { label: 'Контакты', href: '/contacts' },
      ],
    },
  ]

  const [open, setOpen] = React.useState<string | null>(null)
  const toggle = (title: string) => {
    setOpen((prev) => (prev === title ? null : title))
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Desktop */}
        <div className="hidden md:grid grid-cols-4 gap-10 mb-12">
          {/* Logo Column */}
          <div>
            <Link href="/" className="block">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-20 w-auto bg-white p-2 rounded"
              />
            </Link>
          </div>

          {/* Links Columns */}
          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="text-lg font-semibold mb-4 tracking-wide">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden space-y-6 mb-10">
          {/* Logo for mobile */}
          <div className="mb-8">
            <Link href="/" className="block">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-20 w-auto bg-white p-2 rounded"
              />
            </Link>
          </div>

          {groups.map((group) => {
            const isOpen = open === group.title
            return (
              <div key={group.title} className="border-b border-gray-800 pb-4">
                <button
                  onClick={() => toggle(group.title)}
                  className="w-full flex items-center justify-between text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold tracking-wide">
                    {group.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <ul className="mt-4 space-y-2">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400 space-y-3">
          <p className="whitespace-pre-line">
            Люди помогают людям. Вместе мы делаем жизнь проще.
          </p>
          <p>
            © 2025 Services-helper. Все права защищены.
            support@services-helper.com | legal@services-helper.com
          </p>
        </div>
      </div>
    </footer>
  )
}
