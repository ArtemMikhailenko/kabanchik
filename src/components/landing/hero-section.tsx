'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function HeroSection() {
  const router = useRouter()
  const t = useTranslations('landing.hero')

  const handleLookingForSpecialist = () => {
    router.push('/search')
  }

  const handleBecomeSpecialist = () => {
    router.push('/auth/role-selection')
  }

  return (
    <section className="relative min-h-[570px] md:min-h-[680px] flex items-start justify-center overflow-hidden max-h-[1200px] md:max-h-[840px]">
      <div className="relative z-10 container mx-auto px-4 pt-20 md:pt-10 lg:pt-12 pb-10 md:pb-40 lg:pb-44 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[32px] md:text-[64px] font-bold text-gray-900 mb-4 md:mb-4 leading-tight px-2">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-8 md:mb-6 whitespace-pre-line px-4">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center mb-8 px-4">
            <Button
              onClick={handleLookingForSpecialist}
              className="bg-[#ffa657] hover:bg-orange-500 text-black w-full sm:w-auto h-[55px] px-8 md:px-10 rounded-full text-base md:text-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('findSpecialist')}
            </Button>
            <Button
              onClick={handleBecomeSpecialist}
              variant="outline"
              className="bg-white/90 hover:bg-white text-black border-white w-full sm:w-auto h-[55px] px-8 md:px-10 rounded-full text-base md:text-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('becomeSpecialist')}
            </Button>
          </div>
        </div>
      </div>

      {/* Иллюстрация */}
      <div className="absolute inset-x-0 -bottom-6 md:-bottom-6 z-0 pointer-events-none select-none">
        <img
          className="mx-auto h-auto transition-[width] duration-300 ease-out max-w-none w-[190%] sm:w-[160%] md:w-full md:max-w-7xl"
          src="/main/hero.png"
          alt="Platform illustration"
        />
      </div>
    </section>
  )
}
