'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileHeader } from '@/components/profile/profile-header'
import { useProfile } from '@/hooks/useProfile'
import { useUserOrdersForDashboard } from '@/hooks/useUserOrders'
import { useRouter } from 'next/navigation'

import type { Order } from '@/components/dashboard/order-card'
import { AtWorkTab } from '@/features/dashboard/components/at-work-tab'
import { SuggestionsTab } from '@/features/dashboard/components/suggestions-tab'
import { AllOrdersTab } from '@/features/dashboard/components/all-orders-tab'
import { ProfilePromotionTab } from '@/features/dashboard/components/profile-promotion-tab'

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

function AccountPageContent() {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'at-work'
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const [currentPage, setCurrentPage] = useState(1)
  const { profile, loading } = useProfile()
  const { atWorkOrders, allOrders, suggestions, pagination, isLoading: ordersLoading } = useUserOrdersForDashboard()
  const router = useRouter()

  // Синхронизируем activeTab с URL параметром
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1) // Сбрасываем на первую страницу при смене таба
  }

  const handlePageChange = (page: number) => {
    const totalPages = getTotalPages()
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleOrderAction = async (orderId: string) => {
    try {
      if (activeTab === 'suggestions') {
        // Для suggestions - переходим к странице заказа
        router.push(`/order/${orderId}`)
        return
      }

      if (activeTab === 'at-work') {
        // Для at-work - переходим к деталям заказа
        console.log('Viewing order details:', orderId)
        router.push(`/order/${orderId}`)
        return
      }

      // Для остальных табов тоже переходим к заказу
      console.log('Viewing order details:', orderId)
      router.push(`/order/${orderId}`)

      // Остальная логика для других табов...
      console.log('Order action for:', orderId)
      alert(`Действие с заказом ${orderId}`)

    } catch (error) {
      console.error('Error handling order action:', error)
      alert('Произошла ошибка при обработке заказа')
    }
  }

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Отладочная информация
  console.log('Account page data:', {
    atWorkOrders: atWorkOrders.length,
    suggestions: suggestions.length,
    allOrders: allOrders.length,
    activeTab
  })

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <ProfileHeader user={mockUser} />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full bg-white rounded-lg mt-8">
          {/* Tabs navigation - только для заказов */}
          <div className="mb-9">
            <TabsList className="h-auto p-0 bg-transparent w-full justify-start space-x-0 mt-6 p-6">
              <TabsTrigger 
                value="at-work" 
                className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                At work
              </TabsTrigger>
              <TabsTrigger 
                value="suggestions" 
                className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Suggestions
              </TabsTrigger>
              <TabsTrigger 
                value="all-orders" 
                className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                All Orders
              </TabsTrigger>
              <TabsTrigger 
                value="profile-promotion" 
                className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Profile promotion
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="at-work" className="mt-0 p-4">
            <AtWorkTab 
              orders={atWorkOrders}
              currentPage={currentPage}
              totalPages={getTotalPages()}
              onPageChange={handlePageChange}
              onOrderAction={handleOrderAction}
            />
          </TabsContent>

          <TabsContent value="suggestions" className="mt-0 p-4">
            <SuggestionsTab 
              orders={suggestions}
              currentPage={currentPage}
              totalPages={getTotalPages()}
              onPageChange={handlePageChange}
              onOrderAction={handleOrderAction}
            />
          </TabsContent>

          <TabsContent value="all-orders" className="mt-0 p-4">
            <AllOrdersTab 
              currentPage={currentPage} 
              totalPages={getTotalPages()}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="profile-promotion" className="mt-0 p-4">
            <ProfilePromotionTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountPageContent />
    </Suspense>
  )
}
