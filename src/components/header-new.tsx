'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
  useClerk,
} from '@clerk/nextjs'
import {
  Search,
  Grid3X3,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfile } from '@/hooks/useProfile'
import LanguageSwitcher from './language-switcher'
import { useTranslations } from 'next-intl'

export function Header() {
  const t = useTranslations('common')
  const { user } = useUser()
  const { profile } = useProfile()
  const { signOut } = useClerk()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeRole, setActiveRole] = useState<'CUSTOMER' | 'SPECIALIST'>(
    'CUSTOMER'
  )

  // Получаем роль пользователя из профиля (база данных имеет приоритет)
  useEffect(() => {
    if (profile?.role) {
      setActiveRole(profile.role as 'CUSTOMER' | 'SPECIALIST')
    } else if (user?.publicMetadata?.role) {
      setActiveRole(user.publicMetadata.role as 'CUSTOMER' | 'SPECIALIST')
    }
  }, [profile?.role, user?.publicMetadata?.role])

  // Определяем аватар с приоритетом базы данных над Clerk
  const avatarUrl = profile?.avatar || user?.imageUrl
  const userName =
    profile?.displayName ||
    profile?.name ||
    user?.fullName ||
    user?.firstName ||
    'User'

  const handleProfileMenuClick = (action: string) => {
    setIsDropdownOpen(false)

    switch (action) {
      case 'orders':
        // Перейти к заказам
        window.location.href = '/orders'
        break
      case 'view-profile':
        // Для специалистов - страница аккаунта, для клиентов - профиль
        if (activeRole === 'SPECIALIST') {
          window.location.href = '/account'
        } else {
          window.location.href = '/profile'
        }
        break
      case 'profile':
        // Перейти к настройкам аккаунта
        window.location.href = '/account/settings'
        break
      case 'support':
        // Перейти к поддержке
        window.location.href = '/support'
        break
      case 'signout':
        signOut()
        break
    }
  }

  return (
    <header className="w-full bg-transparent absolute top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First row: Logo, Language, Menu/Profile */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              LOGO
            </Link>
          </div>

          {/* Desktop: Search and Categories */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl mx-8">
            <Link href="/categories">
              <Button
                variant="secondary"
                className="bg-[#ffa657] hover:bg-orange-300 text-gray-800 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <Grid3X3 size={16} />
                {t('categories')}
              </Button>
            </Link>

            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('search')}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {/* Mobile: Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu size={24} className="text-gray-900" />
            </button>

            {/* Desktop: Auth Buttons */}
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton>
                  <Button
                    variant="outline"
                    className="rounded-full bg-transparent border-black text-sm px-4 py-2"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <Link href="/auth/role-selection">
                  <Button className="rounded-full bg-[#ffa657] hover:bg-orange-500 text-white text-sm px-4 py-2">
                    Register
                  </Button>
                </Link>
              </div>
            </SignedOut>

            {/* Desktop: User Profile */}
            <SignedIn>
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={avatarUrl} alt={userName} />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">
                    {userName}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={avatarUrl} alt={userName} />
                          <AvatarFallback className="bg-gray-200 text-gray-600">
                            {userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Меню аккаунта
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Role Display */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {activeRole === 'CUSTOMER' ? 'Customer' : 'Specialist'}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => handleProfileMenuClick('orders')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User size={16} />
                        My orders
                      </button>
                      <button
                        onClick={() => handleProfileMenuClick('view-profile')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User size={16} />
                        View Profile
                      </button>
                      <button
                        onClick={() => handleProfileMenuClick('profile')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings size={16} />
                        Account Settings
                      </button>
                      <button
                        onClick={() => handleProfileMenuClick('support')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <HelpCircle size={16} />
                        Tech Support
                      </button>
                      <button
                        onClick={() => handleProfileMenuClick('signout')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                      >
                        <LogOut size={16} />
                        Exit
                      </button>
                    </div>
                  </div>
                )}

                {/* Overlay to close dropdown */}
                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}
              </div>
            </SignedIn>
          </div>
        </div>

        {/* Mobile: Second row with Categories and Search */}
        <div className="md:hidden pb-4">
          <div className="flex items-center gap-3">
            <Link href="/categories">
              <Button
                variant="secondary"
                className="bg-[#ffa657] hover:bg-orange-300 text-gray-800 rounded-full px-4 py-2 flex items-center gap-2 whitespace-nowrap"
              >
                <Grid3X3 size={16} />
                {t('categories')}
              </Button>
            </Link>

            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('search')}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <div className="px-4 py-4">
              <SignedOut>
                <div className="flex flex-col gap-2">
                  <SignInButton>
                    <Button
                      variant="outline"
                      className="w-full rounded-full bg-transparent border-black text-sm px-4 py-2"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <Link
                    href="/auth/role-selection"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full rounded-full bg-[#ffa657] hover:bg-orange-500 text-white text-sm px-4 py-2">
                      Register
                    </Button>
                  </Link>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={avatarUrl} alt={userName} />
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activeRole === 'CUSTOMER' ? 'Customer' : 'Specialist'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleProfileMenuClick('orders')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <User size={16} />
                      My orders
                    </button>
                    <button
                      onClick={() => {
                        handleProfileMenuClick('view-profile')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <User size={16} />
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        handleProfileMenuClick('profile')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <Settings size={16} />
                      Account Settings
                    </button>
                    <button
                      onClick={() => {
                        handleProfileMenuClick('support')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <HelpCircle size={16} />
                      Tech Support
                    </button>
                    <button
                      onClick={() => {
                        handleProfileMenuClick('signout')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border-t border-gray-100"
                    >
                      <LogOut size={16} />
                      Exit
                    </button>
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40 top-16"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </header>
  )
}
