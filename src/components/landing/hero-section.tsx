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
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden ">
      <div className="relative z-10 container mx-auto px-4 pt-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-[72px] font-bold text-gray-900 mb-8 leading-tight">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-[36px] justify-center mb-16">
            <Button
              onClick={handleLookingForSpecialist}
              className="bg-[#ffa657] hover:bg-orange-500 text-black px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('findSpecialist')}
            </Button>
            <Button
              onClick={handleBecomeSpecialist}
              variant="outline"
              className="bg-white/90 hover:bg-white text-gray-900 border-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('becomeSpecialist')}
            </Button>
          </div>
        </div>

        <div className="relative bottom-[-20px] w-full">
          <img
            className="w-full max-w-7xl mx-auto"
            src="/main/hero.png"
            alt="Platform illustration"
          />
        </div>
      </div>
    </section>
  )
}
