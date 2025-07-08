'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import HeroSection from '@/components/landing/hero-section'
import HowItWorksSection from '@/components/landing/HowItWorks'
import SearchSpecialistSection from '@/components/landing/SearchSpecialist'
import TestimonialsSection from '@/components/landing/Testimonials'
import FAQSection from '@/components/landing/FAQ'
import PartnersSection from '@/components/landing/Partners'
import Footer from '@/components/footer'

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
