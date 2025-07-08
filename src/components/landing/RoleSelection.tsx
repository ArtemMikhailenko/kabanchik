'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { DollarSign, Calendar } from 'lucide-react'

export default function RoleSelectionSection() {
  const router = useRouter()

  const handleRoleSelect = (role: 'CUSTOMER' | 'SPECIALIST') => {
    router.push(`/register?role=${role}`)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-teal-400 to-teal-500">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              SELECT AN ACTION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleRoleSelect('CUSTOMER')}
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <Calendar
                        className="w-10 h-10 text-gray-600"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Order a service
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Find and hire specialists for your projects
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleRoleSelect('SPECIALIST')}
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <DollarSign
                        className="w-10 h-10 text-gray-600"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Start earning money
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Offer your services and earn money
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CustomRegistrationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    termsAccepted: false,
  })

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const roleParam = urlParams.get('role')
    if (roleParam) {
      setRole(roleParam)
    }
  }, [])

  const handleGoogleSignUp = () => {
    window.location.href = `/api/auth/google?role=${role}`
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFormSubmit = async () => {
    if (!formData.termsAccepted) {
      alert('Please accept the terms of service')
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push('/registration-success')
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-white rounded-3xl shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Registration of a {role}
              </h2>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">Log in with</p>
                <Button
                  onClick={handleGoogleSignUp}
                  variant="outline"
                  className="w-full rounded-full border-blue-200 py-3 flex items-center justify-center gap-3"
                >
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    G
                  </div>
                  Google
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="block text-gray-700 mb-2">Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full rounded-full"
                    required
                  />
                </div>

                <div>
                  <Label className="block text-gray-700 mb-2">Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full rounded-full"
                    required
                  />
                </div>

                <div>
                  <Label className="block text-gray-700 mb-2">
                    Phone number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full rounded-full"
                    required
                  />
                </div>

                <Button
                  onClick={handleFormSubmit}
                  disabled={isLoading}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-full font-medium mt-6"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.termsAccepted}
                    onChange={(e) =>
                      handleInputChange('termsAccepted', e.target.checked)
                    }
                    className="w-4 h-4 text-teal-400 border-gray-300 rounded focus:ring-teal-400"
                  />
                  <Label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/terms" className="text-teal-400 underline">
                      terms of service
                    </a>
                  </Label>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                  I&apos;m already registered,{' '}
                  <a href="/sign-in" className="text-orange-400 underline">
                    sign in
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
