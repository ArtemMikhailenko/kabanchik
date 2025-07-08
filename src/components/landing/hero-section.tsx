'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Role } from '@prisma/client'

export default function HeroSection() {
  const router = useRouter()
  const { isSignedIn } = useUser()

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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Find Perfect Services
            <br />
            Or Start Earning Today
          </h1>

          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Connect with skilled specialists or offer your expertise to
            customers worldwide
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={handleLookingForSpecialist}
              className="bg-[#ffa657] hover:bg-orange-500 text-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Looking for a specialist
            </Button>
            <Button
              onClick={handleBecomeSpecialist}
              variant="outline"
              className="bg-white/90 hover:bg-white text-gray-900 border-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Become a specialist
            </Button>
          </div>
        </div>

        <div className="relative bottom-[-20px] w-full">
          <img
            className="w-full max-w-5xl mx-auto"
            src="/main/hero.png"
            alt="Platform illustration"
          />
        </div>
      </div>
    </section>
  )
}
