'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

export default function RoleSelectionPage() {
  const router = useRouter()

  const handleRoleSelect = (role: 'SPECIALIST' | 'CUSTOMER') => {
    localStorage.setItem('selectedRole', role)

    router.push(`/auth/register?role=${role}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[990px] p-16 pb-16! bg-[#55c4c8] rounded-[20px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            SELECT AN ACTION
          </h1>
          <p className="text-lg">Choose your role to get started</p>
        </div>

        <div className="flex justify-center gap-6">
          <Card
            className="bg-white  rounded-3xl p-8 pb-0! cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => handleRoleSelect('SPECIALIST')}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-center  gap-[20px]">
                <div className=" flex items-center justify-center">
                  <img
                    className="max-h-[140px]"
                    src="/role/specialist.png"
                    alt=""
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Start earning money
                </h2>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white rounded-3xl p-8 pb-0! cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => handleRoleSelect('CUSTOMER')}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-center gap-[20px]">
                <div className=" flex items-center justify-center">
                  <img
                    className="max-h-[140px]"
                    src="/role/customer.png"
                    alt=""
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center ">
                  Order a service
                </h2>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
