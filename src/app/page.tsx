'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import HeroSection from '@/components/landing/hero-section'
import HowItWorksSection from '@/components/landing/HowItWorks'
import SearchSpecialistSection from '@/components/landing/SearchSpecialist'
import TestimonialsSection from '@/components/landing/Testimonials'
import FAQSection from '@/components/landing/FAQ'
import PartnersSection from '@/components/landing/Partners'

export default function HomePage() {
  const { userId, isLoaded } = useAuth()
  // Removed automatic POST /api/users to avoid duplicate profile creation attempts.
  useEffect(() => {
    // Intentionally left blank; profile creation now handled in registration flow.
  }, [isLoaded, userId])

  return (
    <main className="bg-[#55c4c8] pt-[60px]">
      <HeroSection />
      <HowItWorksSection />
      <SearchSpecialistSection />
      <TestimonialsSection />
      <FAQSection />
      <PartnersSection />
    </main>
  )
}
