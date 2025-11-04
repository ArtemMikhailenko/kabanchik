'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileHeader } from '@/components/profile/profile-header'
import { GeneralInformationTab } from '@/features/profile/components/general-information-tab-new'
import { PortfolioTab } from '@/features/profile/components/portfolio-tab'
import { useProfile } from '@/hooks/useProfile'

const mockUser = {
  id: '1',
  name: 'Matt Cannon',
  avatar: '/photo.png',
  reviewsCount: 456,
  positivePercentage: 99,
  rating: 5,
  subscription: {
    plan: 'Unlimited',
    validUntil: '12 December 2024'
  }
}

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const { profile } = useProfile()
  
  // Check if user is a specialist (has SPECIALIST role)
  const isSpecialist = profile?.role === 'SPECIALIST'

  console.log('Account Settings - Profile role:', profile?.role)
  console.log('Account Settings - Is specialist:', isSpecialist)
  console.log('Account Settings - Active tab:', activeTab)

  const handleExtendClick = () => {
    console.log('Extend button clicked, switching to promotion tab')
    setActiveTab('promotion')
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header - shows avatar upload functionality */}
        <ProfileHeader user={mockUser} onExtendClick={handleExtendClick} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full bg-white rounded-lg mt-8">
          {/* Tabs navigation - только для настроек аккаунта */}
          <div className="mb-9">
            <TabsList className="h-auto p-0 bg-transparent w-full justify-start space-x-0 mt-6 p-6">
              <TabsTrigger 
                value="general" 
                className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                General information
              </TabsTrigger>
              {isSpecialist && (
                <TabsTrigger 
                  value="portfolio" 
                  className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  Portfolio
                </TabsTrigger>
              )}
              {isSpecialist && (
                <TabsTrigger 
                  value="promotion" 
                  className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  Profile promotion
                </TabsTrigger>
              )}
            </TabsList>
            <div className="w-full h-px bg-gray-200 mt-3"></div>
          </div>

          {/* Tab Contents - только для настроек аккаунта */}
          <TabsContent value="general" className="mt-0">
            <GeneralInformationTab />
          </TabsContent>

          {isSpecialist && (
            <TabsContent value="portfolio" className="mt-0 bg-white rounded-lg p-6">
              <PortfolioTab />
            </TabsContent>
          )}

          {isSpecialist && (
            <TabsContent value="promotion" className="mt-0 bg-white rounded-lg p-6">
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-[#282a35]">Profile Promotion Plans</h2>
                <p className="text-[#a3a3a3]">Boost your visibility and get more orders with our promotion plans</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Plan */}
                  <div className="border border-[#e6e6e6] rounded-lg p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-[#282a35] mb-2">Basic</h3>
                    <p className="text-[#a3a3a3] mb-4">Standard visibility</p>
                    <div className="text-3xl font-bold text-[#282a35] mb-4">Free</div>
                    <ul className="text-sm text-[#282a35] space-y-2 mb-6 flex-grow">
                      <li>• Standard search position</li>
                      <li>• Basic profile features</li>
                      <li>• Up to 5 portfolio items</li>
                    </ul>
                    <button className="w-full py-3 px-4 bg-[#f7f7f7] text-[#282a35] rounded-lg font-medium">
                      Current Plan
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="border-2 border-[#ffa657] rounded-lg p-6 flex flex-col relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#ffa657] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Recommended
                    </div>
                    <h3 className="text-xl font-bold text-[#282a35] mb-2">Pro</h3>
                    <p className="text-[#a3a3a3] mb-4">Enhanced visibility</p>
                    <div className="text-3xl font-bold text-[#282a35] mb-4">$29<span className="text-lg">/month</span></div>
                    <ul className="text-sm text-[#282a35] space-y-2 mb-6 flex-grow">
                      <li>• Priority in search results</li>
                      <li>• Featured specialist badge</li>
                      <li>• Up to 20 portfolio items</li>
                      <li>• Profile analytics</li>
                      <li>• Customer contact priority</li>
                    </ul>
                    <button className="w-full py-3 px-4 bg-[#ffa657] text-white rounded-lg font-medium hover:bg-[#ff9a47]">
                      Upgrade to Pro
                    </button>
                  </div>

                  {/* Premium Plan */}
                  <div className="border border-[#e6e6e6] rounded-lg p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-[#282a35] mb-2">Premium</h3>
                    <p className="text-[#a3a3a3] mb-4">Maximum exposure</p>
                    <div className="text-3xl font-bold text-[#282a35] mb-4">$99<span className="text-lg">/month</span></div>
                    <ul className="text-sm text-[#282a35] space-y-2 mb-6 flex-grow">
                      <li>• Top search position</li>
                      <li>• Premium specialist badge</li>
                      <li>• Unlimited portfolio items</li>
                      <li>• Advanced analytics</li>
                      <li>• Priority customer support</li>
                      <li>• Homepage featured section</li>
                    </ul>
                    <button className="w-full py-3 px-4 bg-[#34979a] text-white rounded-lg font-medium hover:bg-[#2d8285]">
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
