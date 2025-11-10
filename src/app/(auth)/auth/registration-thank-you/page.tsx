'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'

export default function RegistrationThankYou() {
  const { user, isLoaded } = useUser()
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)

  useEffect(() => {
    const createUserProfile = async () => {
      if (!isLoaded || !user || profileCreated || isCreatingProfile) return

      const userRole = localStorage.getItem('selectedRole')
      if (!userRole) return

      setIsCreatingProfile(true)

      try {
        console.log('Creating user profile with role:', userRole)

        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: userRole,
          }),
        })

        const data = await response.json()
        console.log('API response:', data)

        if (response.ok || response.status === 409) {
          console.log('User profile created successfully:', data)
          setProfileCreated(true)
        } else {
          console.error('Failed to create user profile:', data.error)
        }
      } catch (error) {
        console.error('Error creating user profile:', error)
      } finally {
        setIsCreatingProfile(false)
      }
    }

    createUserProfile()
  }, [isLoaded, user, profileCreated, isCreatingProfile])

  const handleContinue = () => {
    // Проверяем роль пользователя из localStorage
    const userRole = localStorage.getItem('selectedRole')

    if (userRole === 'SPECIALIST') {
      // Для специалистов переходим на выбор категории
      window.location.href = '/category-selection'
    } else {
      // Для клиентов переходим на дашборд или главную
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-[#55c4c8] rounded-3xl p-12 relative overflow-hidden">
          {/* Основной контент */}
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
              THANK YOU FOR REGISTERING
            </h1>

            <p className="text-lg text-gray-800 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing
              <br />
              elit id venenatis pretium risus euismod dictum
              <br />
              egestas orci netus feugiat ut egestas ut sagittis
              <br />
              tincidunt phasellus elit etiam cursus orci in. Id sed
              <br />
              montes.
            </p>

            {isCreatingProfile && (
              <div className="mb-4 text-sm text-gray-700">
                Creating your profile...
              </div>
            )}

            <Button
              onClick={handleContinue}
              disabled={isCreatingProfile}
              className="bg-[#ffa657] hover:bg-orange-500 text-gray-800 font-medium px-8 py-3 rounded-full text-base disabled:opacity-50"
            >
              {isCreatingProfile ? 'Setting up...' : 'continue'}
            </Button>
          </div>

          {/* Иллюстрация справа */}
          <div className="absolute right-8 bottom-0 top-1/2 transform -translate-y-1/2">
            <svg
              width="400"
              height="200"
              viewBox="0 0 400 200"
              className="text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {/* Первая фигура - руки держат стопку */}
              <g transform="translate(0, 50)">
                <path d="M20 80 Q30 70 40 80 L40 120 Q30 130 20 120 Z" />
                <path d="M60 80 Q70 70 80 80 L80 120 Q70 130 60 120 Z" />
                <rect x="30" y="40" width="30" height="40" rx="5" />
                <rect x="35" y="35" width="20" height="8" rx="4" />
                <rect x="35" y="25" width="20" height="8" rx="4" />
              </g>

              {/* Вторая фигура - пакет */}
              <g transform="translate(100, 60)">
                <rect x="20" y="40" width="40" height="60" rx="5" />
                <path d="M25 40 Q35 30 45 40" />
                <line x1="30" y1="50" x2="50" y2="50" />
                <line x1="30" y1="60" x2="50" y2="60" />
              </g>

              {/* Третья фигура - руки с чашкой */}
              <g transform="translate(200, 50)">
                <path d="M20 80 Q30 70 40 80 L40 120 Q30 130 20 120 Z" />
                <path d="M60 80 Q70 70 80 80 L80 120 Q70 130 60 120 Z" />
                <rect x="35" y="50" width="20" height="25" rx="10" />
                <path d="M55 60 Q65 60 65 70 Q65 80 55 80" />
              </g>

              {/* Четвертая фигура - пакет с ручками */}
              <g transform="translate(300, 60)">
                <rect x="20" y="40" width="40" height="60" rx="5" />
                <path d="M25 45 Q25 35 35 35 Q45 35 45 45" />
                <path d="M55 45 Q55 35 65 35 Q75 35 75 45" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
