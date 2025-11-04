'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  period: string
  description: string
  features: string[]
}

interface PricingCardProps {
  plan: PricingPlan
  onSelect: (planId: string) => void
}

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    <Card className="w-[345px] h-[437px] border-2 border-[#55c4c8] rounded-[16px]">
      <CardContent className="flex flex-col items-center justify-start px-[36px] pt-[24px] pb-[48px] gap-[36px]">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-[20px] w-[312px] h-[82px]">
          <h3 className="text-[20px] font-bold text-[#282a35] text-center leading-[140%]">
            {plan.name}
          </h3>
          <div className="flex items-center gap-[4px]  h-[34px]">
            <span className="text-[48px] font-bold text-[#34979a]">
              {plan.currency}{plan.price}
            </span>
            <span className="text-[24px] font-medium text-[#34979a]">
              / {plan.period}
            </span>
          </div>
        </div>

        {/* Description Paragraph */}
        <p className="w-[286px] text-[18px] font-[DM_Sans] leading-[30px] text-center text-[#646464] h-[155px]">
          {plan.description}
        </p>

        {/* Action Button */}
        <div className="w-[200px] h-[56px]">
          <Button
            className="w-full h-full bg-[#55c4c8] hover:bg-[#47a39f] text-[#282a35] font-medium text-[16px] rounded-full"
            onClick={() => onSelect(plan.id)}
          >
            Get started
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
