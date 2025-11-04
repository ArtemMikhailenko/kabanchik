'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileVerificationBanner } from '@/components/dashboard/profile-verification-banner'
import { AtWorkTab } from '@/features/dashboard/components/at-work-tab'
import { SuggestionsTab } from '@/features/dashboard/components/suggestions-tab'
import { AllOrdersTab } from '@/features/dashboard/components/all-orders-tab'
import { ProfilePromotionTab } from '@/features/dashboard/components/profile-promotion-tab'
import { useProfile } from '@/hooks/useProfile'
import { useUserOrdersForDashboard } from '@/hooks/useUserOrders'
import type { Order } from '@/components/dashboard/order-card'

export default function DashboardPage() {
  const { user } = useUser()
  const { profile, loading: isLoading } = useProfile()
  const { atWorkOrders, allOrders, suggestions, pagination, isLoading: ordersLoading } = useUserOrdersForDashboard()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('at-work')
  const [currentPage, setCurrentPage] = useState(1)

  // Динамически получаем количество страниц в зависимости от активного таба
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1) // Сбрасываем на первую страницу при смене таба
  }

  // Динамически получаем количество страниц в зависимости от активного таба
  const getTotalPages = () => {
    switch(activeTab) {
      case 'at-work':
        return pagination.atWorkTotalPages
      case 'suggestions':
        return pagination.suggestionsTotalPages
      case 'all-orders':
        return pagination.allOrdersTotalPages
      default:
        return 1
    }
  }

  const handlePageChange = (page: number) => {
    const totalPages = getTotalPages()
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleOrderAction = async (orderId: string) => {
    try {
      const action = activeTab === 'suggestions' ? 'accept' : 'view'
      
      if (action === 'accept') {
        const response = await fetch('/api/orders/actions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            action: 'accept'
          })
        })

        if (response.ok) {
          alert('Заказ принят! Он будет перемещен в "At work"')
          // Обновим данные
          window.location.reload()
        } else {
          const error = await response.json()
          alert(`Ошибка: ${error.message}`)
        }
      } else {
        // Для других табов - переход к деталям заказа
        console.log('Viewing order details:', orderId)
        window.location.href = `/order/${orderId}`
      }
    } catch (error) {
      console.error('Error handling order action:', error)
      alert('Произошла ошибка при обработке заказа')
    }
  }

  const handleConfirmVerification = () => {
    console.log('Confirm verification clicked')
    // Простая навигация на страницу аккаунта
    router.push('/account')
  }

  if (isLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Verification Banner */}
        <div className="mb-8 pt-[80px]">
          <ProfileVerificationBanner 
            userName={
              profile?.name || 
              user?.fullName || 
              `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
              user?.emailAddresses[0]?.emailAddress || 
              'Unknown'
            }
            location={profile?.city || 'Локация не указана'}
            isVerified={profile?.isVerified || false}
            onConfirmClick={handleConfirmVerification}
          />
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Custom Tabs List */}
          <div className="mb-8">
            <div className="w-full max-w-[1106px] h-[38px] flex flex-col gap-4">
              {/* Tabs Header */}
              <TabsList className="w-full h-[22px] flex justify-between items-start bg-transparent border-0 rounded-none p-0">
                <TabsTrigger 
                  value="at-work" 
                  className="p-0 bg-transparent text-xl font-bold border-0 rounded-none shadow-none data-[state=active]:text-[#282a35] data-[state=active]:shadow-none data-[state=inactive]:text-[#a3a3a3] hover:bg-transparent leading-[110%]"
                >
                  At work
                </TabsTrigger>
                <TabsTrigger 
                  value="suggestions" 
                  className="p-0 bg-transparent text-xl font-bold border-0 rounded-none shadow-none data-[state=active]:text-[#282a35] data-[state=active]:shadow-none data-[state=inactive]:text-[#a3a3a3] hover:bg-transparent leading-[110%]"
                >
                  suggestions
                </TabsTrigger>
                <TabsTrigger 
                  value="all-orders" 
                  className="p-0 bg-transparent text-xl font-bold border-0 rounded-none shadow-none data-[state=active]:text-[#282a35] data-[state=active]:shadow-none data-[state=inactive]:text-[#a3a3a3] hover:bg-transparent leading-[110%]"
                >
                  all orders
                </TabsTrigger>
                <TabsTrigger 
                  value="profile-promotion" 
                  className="p-0 bg-transparent text-xl font-bold border-0 rounded-none shadow-none data-[state=active]:text-[#282a35] data-[state=active]:shadow-none data-[state=inactive]:text-[#a3a3a3] hover:bg-transparent leading-[110%]"
                >
                  profile promotion
                </TabsTrigger>
              </TabsList>
              
              {/* Underline */}
              <div className="w-full h-0 border-b border-[#282a35] opacity-20"></div>
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="at-work" className="mt-0">
            <AtWorkTab 
              orders={atWorkOrders}
              currentPage={currentPage}
              totalPages={getTotalPages()}
              onPageChange={handlePageChange}
              onOrderAction={handleOrderAction}
            />
          </TabsContent>

          <TabsContent value="suggestions" className="mt-0">
            <SuggestionsTab 
              orders={suggestions}
              currentPage={currentPage}
              totalPages={getTotalPages()}
              onPageChange={handlePageChange}
              onOrderAction={handleOrderAction}
            />
          </TabsContent>

          <TabsContent value="all-orders" className="mt-0">
            <AllOrdersTab 
              currentPage={currentPage}
              totalPages={getTotalPages()}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="profile-promotion" className="mt-0">
            <ProfilePromotionTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}