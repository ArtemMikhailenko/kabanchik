'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import HeroSection from '@/components/sections/HeroSection'
import HowItWorksSection from '@/components/sections/HowItWorks'
import SearchSpecialistSection from '@/components/sections/SearchSpecialist'
import TestimonialsSection from '@/components/sections/Testimonials'
import FAQSection from '@/components/sections/FAQ'
import PartnersSection from '@/components/sections/Partners'
import Footer from '@/components/Footer/Footer'

export default function HomePage() {
  const { userId, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded && userId) {
      fetch('/api/users', { method: 'POST' }).catch(console.error)
    }
  }, [isLoaded, userId])

  return (
    <main className="bg-[#55c4c8] pt-[60px]">
      <HeroSection />
      <HowItWorksSection />
      <SearchSpecialistSection />
      <TestimonialsSection />
      <FAQSection />
      <PartnersSection />
      <Footer />
    </main>
  )
}
