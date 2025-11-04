'use client'

import React from 'react'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileVerificationBannerProps {
  userName?: string
  location?: string
  isVerified?: boolean
  onConfirmClick?: () => void
}

export function ProfileVerificationBanner({ 
  userName = "Matt Cannon", 
  location = "Kyiv",
  isVerified = false,
  onConfirmClick 
}: ProfileVerificationBannerProps) {
  return (
    <div className="w-full max-w-[1200px] h-[133px] bg-[#ffdcbc] rounded-2xl flex items-center justify-between px-9 py-9 gap-7">
      {/* Left section - User info */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[32px] font-bold text-[#282a35] leading-[150%]">
          {userName}
        </h2>
        <div className="flex items-end gap-0">
          <MapPin className="w-6 h-6 text-[#282a35]" />
          <span className="text-sm text-[#282a35] leading-[150%] text-center ml-0">
            {location}
          </span>
        </div>
      </div>

      {/* Center section - Message */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-base font-medium text-black leading-[150%]">
          {isVerified 
            ? 'Your profile has been verified.' 
            : 'Your profile has not been verified.'
          }
        </p>
      </div>

      {/* Right section - Button */}
      {!isVerified && (
        <Button
          onClick={onConfirmClick}
          className="w-[279px] h-[55px] bg-[#ffa657] hover:bg-[#ff9a47] text-[#282a35] rounded-[50px] px-9 py-[18px] text-base font-medium leading-[120%]"
        >
          Confirm now
        </Button>
      )}
    </div>
  )
}
