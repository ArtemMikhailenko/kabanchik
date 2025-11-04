'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

interface Order {
  id: string
  title: string
  categoryName: string
  budget: number | null
  createdAt: string
}

interface WorkingSpecialist {
  id: string
  userId: string
  name: string
  avatar: string
  bio?: string | null
  rating: number
  reviewCount: number
  categories: string[]
  orders: Order[]
}

interface SelectedSpecialistsTabProps {
  specialists: WorkingSpecialist[]
  loading: boolean
}

export function SelectedSpecialistsTab({ specialists, loading }: SelectedSpecialistsTabProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-600">
        Loading specialists...
      </div>
    )
  }

  if (specialists.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">No specialists working yet</h3>
        <p className="text-gray-600">
          Specialists who are currently working on your orders will appear here.
        </p>
      </div>
    )
  }

  // Calculate positive percentage (using rating as base)
  const getPositivePercentage = (rating: number) => {
    return Math.round((rating / 5) * 100)
  }

  return (
    <div className="space-y-6">
      {specialists.map((specialist) => {
        const positivePercentage = getPositivePercentage(specialist.rating)
        
        return (
          <div
            key={specialist.id}
            className="bg-white border border-[#e6e6e6] rounded-3xl px-6 pt-6 pb-12 flex items-end gap-[102px]"
          >
            {/* Left: Avatar + Name + Location */}
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={specialist.avatar}
                  alt={specialist.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-[22px]">
                <h3 className="text-2xl font-bold text-[#282a35] leading-[150%]">
                  {specialist.name}
                </h3>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#a3a3a3]" />
                  <span className="text-sm text-[#a3a3a3]">Kyiv</span>
                </div>
              </div>
            </div>

            {/* Center: Reviews + Positive + Rating */}
            <div className="flex items-center gap-9">
              {/* Reviews & Positive */}
              <div className="flex items-center gap-3">
                {/* Reviews */}
                <div className="flex flex-col gap-1.5 items-start">
                  <span className="text-2xl font-medium text-[#282a35] leading-[140%]">
                    {specialist.reviewCount}
                  </span>
                  <span className="text-sm text-[#282a35] leading-[150%]">
                    reviews
                  </span>
                </div>

                {/* Divider */}
                <div className="w-px h-9 bg-[#a3a3a3]" />

                {/* Positive */}
                <div className="flex flex-col gap-1.5 items-start">
                  <span className="text-2xl font-medium text-[#282a35] leading-[140%]">
                    {positivePercentage}%
                  </span>
                  <span className="text-sm text-[#282a35] leading-[150%]">
                    positive
                  </span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0066 2.00201L14.8232 8.82868L22.0132 9.56535L16.5466 14.3987L18.1999 21.4387L12.0066 17.782L5.81323 21.4387L7.46656 14.3987L2 9.56535L9.18989 8.82868L12.0066 2.00201Z"
                      fill={star <= Math.round(specialist.rating) ? '#FFA657' : '#e6e6e6'}
                      stroke={star <= Math.round(specialist.rating) ? '#FFA657' : '#e6e6e6'}
                    />
                  </svg>
                ))}
              </div>
            </div>

            {/* Right: Job Offer Button */}
            <div className="ml-auto">
              <Link
                href={`/specialists/${specialist.userId}`}
                className="inline-flex items-center justify-center px-9 py-4 bg-[#55c4c8] text-[#282a35] text-base font-medium rounded-[50px] hover:bg-[#4ab5b9] transition-colors leading-[120%]"
              >
                job offer
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
