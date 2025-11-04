'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { Star, Shield, CheckCircle, Edit, Link, LinkIcon } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

interface ProfileHeaderProps {
  user: {
    id: string
    name: string
    avatar: string
    reviewsCount: number
    positivePercentage: number
    rating: number
    subscription: {
      plan: string
      validUntil: string
    }
  }
  onExtendClick?: () => void
}

export function ProfileHeader({ user, onExtendClick }: ProfileHeaderProps) {
  const { profile } = useProfile()
  const { user: clerkUser } = useUser()
  const pathname = usePathname()
  
  // Определяем, находимся ли мы на странице настроек аккаунта
  const isAccountSettings = pathname?.includes('/account/settings')
  
  // Проверяем, является ли пользователь специалистом
  const isSpecialist = profile?.role === 'SPECIALIST'
  
  // Логгируем данные для отладки
  console.log('Profile data:', profile)
  console.log('Clerk user data:', clerkUser)
  console.log('Is specialist:', isSpecialist)
  
  // Используем реальные данные профиля с приоритетом над mock данными
  const displayData = {
    name: profile?.name || clerkUser?.fullName || 'User',
    avatar: profile?.avatar || clerkUser?.imageUrl || '/photo.png',
    email: profile?.email || clerkUser?.emailAddresses?.[0]?.emailAddress || '',
    // Используем реальные данные отзывов из профиля, fallback к 0
    reviewsCount: (profile as any)?.reviewsCount || 0,
    positivePercentage: (profile as any)?.positivePercentage || 100,
    rating: (profile as any)?.averageRating || 0,
    subscription: profile?.subscription || { plan: 'Basic', validUntil: 'N/A' },
    isVerified: profile?.isVerified || false,
    bio: profile?.bio || 'No bio provided'
  }
    return (
      <Card className="mx-auto  h-[430px] bg-white rounded-[16px] pt-[24px] pr-[36px] pb-[48px] pl-[36px]">
        <CardContent className="flex gap-[28px] p-0">
          {/* Left section */}
          <div className="flex gap-[28px]">
            {/* Avatar (180×180, cornerRadius 10.2857) */}
            <div className="relative w-[180px] h-[180px] rounded-[10.2857px] overflow-hidden">
              {isAccountSettings ? (
                <AvatarUpload
                  currentAvatar={displayData.avatar}
                  userName={displayData.name}
                  size="lg"
                />
              ) : (
                <>
                  <img
                    src={displayData.avatar}
                    alt={displayData.name}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute left-[78px] top-[78px] w-[24px] h-[24px] flex items-center justify-center">
                    <Edit className="w-[19px] h-[19px] text-white" />
                  </button>
                </>
              )}
            </div>
  
            {/* Name, subtitle and stats */}
            <div className="flex flex-col gap-[20px] w-[547px]">
              {/* Name + subtitle */}
              <div className="flex flex-col gap-[12px]">
                <h1 className="text-[32px] font-bold text-[#282a35] leading-[150%]">
                  {displayData.email}
                </h1>
                <p className="text-[16px] text-[#a3a3a3] leading-[150%]">
                  See what the profile looks like for everyone
                </p>
              </div>
  
              {/* Reviews / positive / stars row */}
              <div className="flex items-center gap-[36px]">
                {/* Reviews */}
                <div className="flex items-center gap-[12px]">
                  <div className="flex flex-col items-center gap-[6px] w-[54px]">
                    <span className="text-[24px] font-medium text-[#282a35] leading-[140%]">
                      {displayData.reviewsCount}
                    </span>
                    <span className="text-[14px] text-[#282a35] opacity-50 leading-[150%]">
                      reviews
                    </span>
                  </div>
                  {/* Divider */}
                  <div className="w-[36px] h-0 border-t border-[#a3a3a3] rotate-[-90deg]" />
                  {/* Positive */}
                  <div className="flex flex-col items-start gap-[6px] w-[54px]">
                    <span className="text-[24px] font-medium text-[#282a35] leading-[140%]">
                      {displayData.positivePercentage}%
                    </span>
                    <span className="text-[14px] text-[#282a35] opacity-50 leading-[150%]">
                      positive
                    </span>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex items-center gap-[8px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-[24px] h-[24px] ${
                        i < displayData.rating
                          ? 'text-[#ffa657] fill-[#ffa657]'
                          : 'text-[#e6e6e6]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* My tariff plan section - только для специалистов */}
              {isSpecialist && (
                <div className="w-[486px] h-[72px] bg-white border border-[#e6e6e6] rounded-[8px] flex items-center px-[24px] py-[16px] gap-[28px] mt-[20px]">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[16px] font-medium text-[#282a35] leading-[150%]">
                      My tariff plan
                    </span>
                  </div>
                  <div className="w-[36px] h-0 border-t border-[#282a35] opacity-20 rotate-[-90deg]" />
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[16px] font-bold text-[#282a35] leading-[140%]">
                      {displayData.subscription.plan}
                    </span>
                    <span className="text-[12px] text-[#a3a3a3] leading-[130%]">
                      valid until {displayData.subscription.validUntil}
                    </span>
                  </div>
                  <Button 
                    className="ml-auto bg-[#ffa657] hover:bg-[#ff9a47] text-[#282a35] text-[16px] font-medium px-[36px] py-[16px] h-[35px] rounded-[50px] leading-[120%]"
                    onClick={onExtendClick}
                  >
                    extend
                  </Button>
                </div>
              )}

              {/* Verified & Safety */}
              <div className="flex items-center gap-[36px] mt-[21px]">
                <div className="flex items-center gap-[4px]">
                  <CheckCircle className="w-[20px] h-[20px] text-[#34979a]" />
                  <span className="text-[14px] font-medium text-[#34979a] leading-[150%]">
                    Verified information
                  </span>
                </div>
                <div className="flex items-center gap-[4px]">
                  <Shield className="w-[20px] h-[20px] text-[#34979a]" />
                  <span className="text-[14px] font-medium text-[#34979a] leading-[150%]">
                    Сustomer safety
                  </span>
                </div>
              </div>
            </div>
          </div>
  
          {/* Right section */}
          <div className="flex flex-col gap-[16px] w-[345px]">
            {/* Profile link card */}
            <Card className="bg-white border border-[#e6e6e6] rounded-[8px] w-full h-[166px] py-[12px]">
              <CardContent className="flex flex-col gap-[8px] ">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[24px] h-[24px] flex items-center justify-center">
                    <LinkIcon className="w-[17px] h-[17px] text-[#34979a]" />
                  </div>
                  <span className="text-[16px] font-bold text-[#34979a] leading-[150%]">
                    Link to the profile
                  </span>
                </div>
                <p className="text-[12px] text-[#282a35] opacity-50 leading-[150%] w-[275px] h-[54px]">
                  Post links to other resources on your public profile to convince
                  customers of your competence and responsibility!
                </p>
                <Input
                  placeholder="https://company name"
                  className="bg-[#f7f7f7] rounded-[40px] px-[20px] py-[12px] text-[16px] h-[48px] w-[297px] border-none leading-[150%]"
                />
              </CardContent>
            </Card>
  
            {/* Top specialist card */}
            <Card className="bg-white border border-[#e6e6e6] rounded-[8px] w-full h-[80px] py-[12px]">
              <CardContent className="flex flex-col gap-[8px] ">
                <div className="flex items-center gap-[8px]">
                  <CheckCircle className="w-[20px] h-[20px] text-[#34979a]" />
                  <span className="text-[16px] font-bold text-[#34979a] leading-[150%]">
                    TOP specialist
                  </span>
                </div>
                <p className="text-[14px] text-[#282a35] opacity-50 leading-[150%] w-[297px] h-[24px] truncate">
                  Lorem ipsum dolor sit amet consectetur. Cur...
                </p>
              </CardContent>
            </Card>

            {/* Second Top specialist card */}
            <Card className="bg-white border border-[#e6e6e6] rounded-[8px] w-full h-[80px] py-[12px]">
              <CardContent className="flex flex-col gap-[8px] ">
                <div className="flex items-center gap-[8px]">
                  <CheckCircle className="w-[20px] h-[20px] text-[#34979a]" />
                  <span className="text-[16px] font-bold text-[#34979a] leading-[150%]">
                    TOP specialist
                  </span>
                </div>
                <p className="text-[14px] text-[#282a35] opacity-50 leading-[150%] w-[297px] h-[24px] truncate">
                  Lorem ipsum dolor sit amet consectetur. Cur...
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    )
  }