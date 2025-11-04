'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Shield, CheckCircle } from 'lucide-react'
import { OfferOrderForm } from '@/components/customer/offer-order-form'

interface SpecialistResponse {
  id: string
  name: string
  photo: string
  city: string
  rating: number
  reviewCount: number
  positivePercentage: number
  description: string
  isOnline: boolean
  lastSeen: string
  services: Array<{ id: string; title: string }>
  portfolioItems: Array<{ id: string; images: string[] }>
  mainCategory: { id: string; name: string; slug: string } | null
}

export default function JobOfferCreatePage() {
  const params = useParams<{ specialistId: string }>()
  const router = useRouter()
  const specialistId = params?.specialistId
  const [specialist, setSpecialist] = useState<SpecialistResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!specialistId) return
      try {
        setLoading(true)
        const res = await fetch(`/api/specialists/${specialistId}`)
        if (!res.ok) {
          throw new Error(`Failed to load specialist: ${res.status}`)
        }
        const data = await res.json()
        setSpecialist(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load specialist')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [specialistId])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-12">Loading specialist…</div>
      </main>
    )
  }

  if (error || !specialist) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-12 text-red-600">
          {error || 'Specialist not found'}
        </div>
      </main>
    )
  }

  const initials = specialist.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <main className="min-h-screen bg-[#F7F7F7] pt-24 pb-12">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header with specialist info */}
        <div className="w-full bg-white rounded-2xl border border-[#e6e6e6] p-9 mb-12">
          <div className="flex gap-7">
            {/* Left Section - Specialist Info */}
            <div className="flex-1">
              <div className="flex gap-6 mb-5">
                {/* Avatar */}
                <div className="w-[180px] h-[180px] rounded-full bg-gray-200 overflow-hidden">
                  <Avatar className="w-[180px] h-[180px]">
                    <AvatarImage src={specialist.photo} alt={specialist.name} />
                    <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-[32px] font-bold text-[#282a35] opacity-80 mb-3 leading-[150%]">
                    {specialist.name}
                  </h1>

                  <div className="flex items-center gap-2 mb-6 text-[#282a35] opacity-80">
                    <MapPin className="w-5 h-5 text-[#a3a3a3]" />
                    <span className="text-sm">{specialist.city || 'Not specified'}</span>
                  </div>

                  {/* Reviews and Rating */}
                  <div className="flex items-center gap-9 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-medium text-[#282a35] opacity-80 leading-[140%]">
                          {specialist.reviewCount}
                        </div>
                        <div className="text-sm text-[#282a35] opacity-80">reviews</div>
                      </div>
                      <div className="w-px h-12 bg-[#a3a3a3]"></div>
                      <div className="text-center">
                        <div className="text-2xl font-medium text-[#282a35] opacity-80 leading-[140%]">
                          {specialist.positivePercentage}%
                        </div>
                        <div className="text-sm text-[#282a35] opacity-80">positive</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= Math.floor(specialist.rating)
                        const isPartial = star === Math.ceil(specialist.rating) && specialist.rating % 1 !== 0
                        return (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              isFilled || (isPartial && specialist.rating > 0)
                                ? 'fill-[#ffa657] text-[#ffa657]'
                                : 'text-gray-300'
                            }`}
                          />
                        )
                      })}
                    </div>

                  {/* Verification Badges */}
                  </div>
                  <div className="flex items-center gap-9">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-5 h-5 text-[#34979a]" />
                      <span className="text-sm font-medium text-[#34979a]">Verified information</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-5 h-5 text-[#34979a]" />
                      <span className="text-sm font-medium text-[#34979a]">Customer safety</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offer Form (custom layout) */}
        <OfferOrderForm
          specialistId={specialist.id}
          mainCategoryName={specialist.mainCategory?.name || null}
          onSuccess={() => router.push('/profile?tab=new-order')}
        />
      </div>
    </main>
  )
}
