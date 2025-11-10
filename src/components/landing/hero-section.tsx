'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Role } from '@prisma/client'
import { useTranslations } from 'next-intl'

export default function HeroSection() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const t = useTranslations('landing.hero')

  const handleRoleSelection = (role: Role) => {
    if (isSignedIn) {
      localStorage.setItem('selectedRole', role)
      router.push('/profile/setup')
    } else {
      localStorage.setItem('selectedRole', role)
      router.push('/register')
    }
  }

  const handleLookingForSpecialist = () => {
    handleRoleSelection(Role.CUSTOMER)
  }

  const handleBecomeSpecialist = () => {
    handleRoleSelection(Role.SPECIALIST)
  }

  return (
    <section className="relative min-h-[680px] flex items-start justify-center overflow-hidden max-h-[820px]">
      <div className="relative z-10 container mx-auto px-4 pt-6 md:pt-10 lg:pt-12 pb-28 md:pb-40 lg:pb-44 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[36px] md:text-[60px] font-bold text-gray-900 mb-4 leading-tight">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-5">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-8">
            <Button
              onClick={handleLookingForSpecialist}
              className="bg-[#ffa657] hover:bg-orange-500 text-black px-7 py-5 rounded-full text-base md:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('findSpecialist')}
            </Button>
            <Button
              onClick={handleBecomeSpecialist}
              variant="outline"
              className="bg-white/90 hover:bg-white text-gray-900 border-white px-7 py-5 rounded-full text-base md:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('becomeSpecialist')}
            </Button>
          </div>
        </div>
      </div>

      {/* Иллюстрация закреплена к нижнему краю всей секции (а не внутреннего контейнера) */}
      <div className="absolute inset-x-0 -bottom-6 z-0 pointer-events-none select-none">
        <img
          className="w-full max-w-7xl mx-auto h-auto"
          src="/main/hero.png"
          alt="Platform illustration"
        />
      </div>
    </section>
  )
}
