'use client'

import { SignUp } from '@clerk/nextjs'
import { Role } from '@prisma/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RegisterPage() {
  // TODO: add nuqs to handle role selection
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  useEffect(() => {
    const roleFromUrl = searchParams.get('role')
    const roleFromStorage = localStorage.getItem('selectedRole')
    const role = roleFromUrl || roleFromStorage

    if (role && [Role.SPECIALIST, Role.CUSTOMER].includes(role as Role)) {
      setSelectedRole(role as Role)
      localStorage.setItem('selectedRole', role)
    } else {
      router.push('/auth/role-selection')
    }
  }, [searchParams, router])

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Redirecting to role selection...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registration as{' '}
            {selectedRole === Role.SPECIALIST ? 'Specialist' : 'Customer'}
          </h1>
          <p className="text-sm text-gray-600">
            Selected role:{' '}
            {selectedRole === Role.SPECIALIST ? 'Specialist' : 'Customer'}
          </p>
        </div>

        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  'bg-orange-400 hover:bg-orange-500 text-sm normal-case',
                card: 'shadow-xl w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'border border-gray-300 hover:bg-gray-50',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-500',
                formFieldInput:
                  'border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400',
                footerActionLink: 'text-orange-500 hover:text-orange-600',
              },
              layout: {
                socialButtonsPlacement: 'top',
                showOptionalFields: false,
              },
            }}
            signInUrl="/auth/sign-in"
            routing="path"
            path="/auth/register"
            redirectUrl="/auth/registration-thank-you"
            unsafeMetadata={{
              role: selectedRole,
            }}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already registered?{' '}
            <button
              onClick={() => router.push('/auth/sign-in')}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign in
            </button>
          </p>

          <div className="mt-3">
            <button
              onClick={() => {
                localStorage.removeItem('selectedRole')
                router.push('/auth/role-selection')
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Change role selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
