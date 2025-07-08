'use client'

import { SignUp } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  useEffect(() => {
    const roleFromUrl = searchParams.get('role')
    const roleFromStorage = localStorage.getItem('selectedRole')
    const role = roleFromUrl || roleFromStorage

    if (role && ['SPECIALIST', 'CUSTOMER'].includes(role)) {
      setSelectedRole(role)
      localStorage.setItem('selectedRole', role)
    } else {
      router.push('/role-selection')
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Registration as{' '}
              {selectedRole === 'SPECIALIST' ? 'Specialist' : 'Customer'}
            </h1>
            <p className="text-sm text-gray-600">
              Selected role:{' '}
              {selectedRole === 'SPECIALIST' ? 'Specialist' : 'Customer'}
            </p>
          </div>

          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  'bg-orange-400 hover:bg-orange-500 text-sm normal-case',
                card: 'shadow-none',
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
            signInUrl="/sign-in"
            routing="path"
            path="/register"
            unsafeMetadata={{
              role: selectedRole,
            }}
            redirectUrl="/"
            afterSignUpUrl="/"
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already registered?{' '}
              <button
                onClick={() => router.push('/sign-in')}
                className="text-orange-500 hover:text-orange-600 underline"
              >
                Sign in
              </button>
            </p>

            <div className="mt-4">
              <button
                onClick={() => {
                  localStorage.removeItem('selectedRole')
                  router.push('/role-selection')
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Change role selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
