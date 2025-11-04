'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Shield, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface Specialist {
  id: string
  name: string
  title: string
  avatar: string
  rating: number
  reviewsCount: number
  positivePercentage: number
  description: string
  isVerified: boolean
  isCustomerSafe: boolean
}

interface SpecialistCardProps {
  specialist: Specialist
  onJobOffer: (specialistId: string) => void
  onLearnMore: (specialistId: string) => void
}

export function SpecialistCard({ specialist, onJobOffer, onLearnMore }: SpecialistCardProps) {
  const t = useTranslations('specialist')
  
  return (
    <Card className="w-full h-[319px] bg-white border border-[#f7f7f7] rounded-[24px] hover:shadow-md transition-shadow px-[24px] pt-8 pb-12">
      <CardContent className="">
        <div className="flex gap-[60px] h-[239px]">
          {/* Left Section - Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="w-[200px] h-[200px]">
              <AvatarImage src={specialist.avatar} alt={specialist.name} />
              <AvatarFallback className="text-2xl font-['Helvetica_Neue']">
                {specialist.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Middle Section - Main Content */}
          <div className="flex flex-col gap-3 flex-1 h-[239px]">
            {/* Main content area */}
            <div className="flex flex-col gap-3 h-[194px]">
              {/* Name and Title */}
              <div className="flex flex-col gap-1 h-[51px]">
                <h3 className="text-[20px] font-bold text-[#282a35] leading-[150%] font-['Helvetica_Neue'] h-[23px]">
                  {specialist.name}
                </h3>
                <p className="text-[16px] text-[#a3a3a3] leading-[150%] font-['Helvetica_Neue'] h-[24px]">
                  {specialist.title}
                </p>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-2 w-[152px] h-6">
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

              {/* Description */}
              <p className="text-[16px] text-[#282a35] leading-[150%] font-['Helvetica_Neue'] overflow-hidden">
                {specialist.description}
              </p>
            </div>

            {/* Verification Badges */}
            <div className="flex gap-9 w-[317px] h-[21px]">
              {specialist.isVerified && (
                <div className="flex items-center gap-1 w-[150px] h-[21px]">
                  <CheckCircle className="w-5 h-5 text-[#34979a]" />
                  <span className="text-[#34979a] font-medium text-[14px] leading-[150%] font-['Helvetica_Neue']">
                    {t('verifiedInformation')}
                  </span>
                </div>
              )}
              {specialist.isCustomerSafe && (
                <div className="flex items-center gap-1 w-[131px] h-[21px]">
                  <Shield className="w-5 h-5 text-[#34979a]" />
                  <span className="text-[#34979a] font-medium text-[14px] leading-[150%] font-['Helvetica_Neue']">
                    {t('customerSafety')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Stats and Actions */}
          <div className="flex flex-col items-center gap-4 w-[215px] h-[182px] flex-shrink-0">
            {/* Stats */}
            <div className="flex items-center justify-center gap-3 w-[132px] h-12 ml-[41.5px]">
              <div className="text-center w-[54px] h-[47px]">
                <div className="text-[24px] font-medium text-[#282a35] leading-[140%] font-['Helvetica_Neue'] h-5">
                  {specialist.reviewsCount}
                </div>
                <div className="text-[14px] text-[#282a35] leading-[150%] font-['Helvetica_Neue'] h-[21px] mt-[6px]">
                  {t('reviews')}
                </div>
              </div>
              
              {/* Vertical Divider */}
              <div className="w-[36px] h-px bg-[#a3a3a3] rotate-90"></div>
              
              <div className="text-center w-[54px] h-12">
                <div className="text-[24px] font-medium text-[#282a35] leading-[140%] font-['Helvetica_Neue'] h-[21px]">
                  {specialist.positivePercentage}%
                </div>
                <div className="text-[14px] text-[#282a35] leading-[150%] font-['Helvetica_Neue'] h-[21px] mt-[6px]">
                  {t('positive')}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-[215px]">
              <Button
                onClick={() => onJobOffer(specialist.id)}
                className="w-[215px] h-[51px] bg-[#55c4c8] hover:bg-[#4ab3b7] text-[#282a35] font-medium text-[16px] rounded-[50px] px-9 py-6 font-['Helvetica_Neue'] leading-[120%]"
              >
                {t('jobOffer')}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onLearnMore(specialist.id)}
                className="w-[215px] h-[51px] bg-transparent border border-[#55c4c8] text-[#282a35] hover:bg-[#55c4c8]/10 font-medium text-[16px] rounded-[50px] px-9 py-4 font-['Helvetica_Neue'] leading-[120%]"
              >
                {t('viewProfile')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}