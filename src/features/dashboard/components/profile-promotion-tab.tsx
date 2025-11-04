// src/features/profile/components/profile-promotion-tab.tsx
'use client'

import React from 'react'
import { PricingCard } from '@/components/pricing/pricing-card'

interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  period: string
  description: string
  features: string[]
}

export function ProfilePromotionTab() {
  // Mock pricing plans
  const pricingPlans: PricingPlan[] = [
    {
      id: 'personal-1',
      name: 'Personal License',
      price: 39,
      currency: '$',
      period: 'mo.',
      description: 'Lorem ipsum dolor sit amet consectetur. Tellus turpis nibh tristique at eget. Lectus et arcu sit bibendum. Suscipit libero tincidunt elementum vestibulum...',
      features: []
    },
    {
      id: 'personal-2',
      name: 'Personal License',
      price: 39,
      currency: '$',
      period: 'mo.',
      description: 'Lorem ipsum dolor sit amet consectetur. Tellus turpis nibh tristique at eget. Lectus et arcu sit bibendum. Suscipit libero tincidunt elementum vestibulum...',
      features: []
    },
    {
      id: 'personal-3',
      name: 'Personal License',
      price: 39,
      currency: '$',
      period: 'mo.',
      description: 'Lorem ipsum dolor sit amet consectetur. Tellus turpis nibh tristique at eget. Lectus et arcu sit bibendum. Suscipit libero tincidunt elementum vestibulum...',
      features: []
    }
  ]

  const handlePlanSelect = (planId: string) => {
    console.log('Selected plan:', planId)
    // Здесь будет логика выбора тарифного плана
  }

  return (
    <div className="py-8 mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
        {pricingPlans.map(plan => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>
    </div>
  )
}