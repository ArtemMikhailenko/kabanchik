'use client'

import React, { useMemo, useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileHeader } from '@/components/profile/profile-header'
import { AtWorkTab } from '@/features/dashboard/components/at-work-tab'
import { AllOrdersTab } from '@/features/dashboard/components/all-orders-tab'
import { CreateOrderForm } from '@/components/customer/create-order-form'
import { UserOrdersList } from '@/components/customer/user-orders-list'
import { SelectedSpecialistsTab } from '@/components/customer/selected-specialists-tab'
import { useUserOrders, useUserOrdersForDashboard } from '@/hooks/useUserOrders'
import { useProfile } from '@/hooks/useProfile'
import { useWorkingSpecialists } from '@/hooks/useWorkingSpecialists'
import type { Order } from '@/components/dashboard/order-card'

function ProfilePageContent() {
  const { profile, loading } = useProfile()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'at-work'
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const [currentPage, setCurrentPage] = useState(1)
  const [isOrderFormExpanded, setIsOrderFormExpanded] = useState(false) // Изначально свернута
  // Dashboard orders (at-work/all/suggestions) for the current user
  const { atWorkOrders, isLoading: dashboardLoading, error: dashboardError, pagination } = useUserOrdersForDashboard()

  // Создаем объект пользователя из реальных данных профиля
  const userData = {
    id: profile?.id || '1',
    name: profile?.name || 'User',
    avatar: profile?.avatar || '/photo.png',
    reviewsCount: 456, // Можно заменить на реальные данные когда они будут доступны
    positivePercentage: 99,
    rating: 4.9, // Добавляем рейтинг
    subscription: {
      plan: 'Pro',
      validUntil: '2024-12-31'
    }
  }

  // Загружаем заказы пользователя (для блока New Order / список заказов)
  const { orders: userOrders, loading: ordersLoading, error: ordersError, refetchOrders } = useUserOrders()

  // Загружаем специалистов, работающих над заказами
  const { specialists: workingSpecialists, loading: specialistsLoading, refetch: refetchSpecialists } = useWorkingSpecialists()

  // Синхронизируем activeTab с URL параметром
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  // Автоматически обновляем заказы при переключении на вкладку New Order
  React.useEffect(() => {
    if (activeTab === 'new-order') {
      refetchOrders()
    } else if (activeTab === 'selected-specialists') {
      refetchSpecialists()
    }
  }, [activeTab])

  console.log('ProfilePage userOrders:', userOrders, 'loading:', ordersLoading, 'error:', ordersError)
  console.log('ProfilePage atWorkOrders:', atWorkOrders?.length, 'dashboardLoading:', dashboardLoading, 'dashboardError:', dashboardError)

  // Пагинация для вкладки "At work"
  const itemsPerPage = pagination.itemsPerPage || 6
  const pagedAtWorkOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return Array.isArray(atWorkOrders) ? (atWorkOrders as Order[]).slice(start, end) : []
  }, [atWorkOrders, currentPage, itemsPerPage])

  const handleOrderAction = (orderId: string) => {
    console.log('Order action for:', orderId)
    // Переход на страницу заказа
    router.push(`/order/${orderId}`)
  }

  const handleToggleOrderForm = () => {
    setIsOrderFormExpanded(!isOrderFormExpanded)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Обновляем список заказов после создания нового заказа
  const handleOrderCreated = () => {
    refetchOrders()
    setIsOrderFormExpanded(false)
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <ProfileHeader user={userData} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full bg-white rounded-lg mt-8">
          {/* Tabs navigation - 4 основных таба */}
          <div className="mb-9">
            <TabsList className="h-auto p-0 bg-transparent w-full justify-start space-x-0 mt-6 p-6">
              <TabsTrigger 
                value="at-work" 
                className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                At work
              </TabsTrigger>
              <TabsTrigger 
                value="new-order" 
                className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                New Order
              </TabsTrigger>
              <TabsTrigger 
                value="selected-specialists" 
                className="relative px-0 py-0 mr-9 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Selected Specialists
              </TabsTrigger>
              <TabsTrigger 
                value="order-history" 
                className="relative px-0 py-0 bg-transparent text-xl font-bold text-[#a3a3a3] data-[state=active]:text-[#282a35] border-none rounded-none shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Order History
              </TabsTrigger>
            </TabsList>
            <div className="w-full h-px bg-gray-200 mt-3"></div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="at-work" className="mt-0 bg-white p-6 rounded-lg">
            {dashboardLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-600">Loading...</div>
            ) : (
              <AtWorkTab 
                orders={pagedAtWorkOrders}
                currentPage={currentPage}
                totalPages={pagination.atWorkTotalPages || 1}
                onPageChange={handlePageChange}
                onOrderAction={handleOrderAction}
              />
            )}
          </TabsContent>

          <TabsContent value="new-order" className="mt-0 bg-white p-6 rounded-lg">
            <CreateOrderForm 
              isExpanded={isOrderFormExpanded}
              onToggleExpand={handleToggleOrderForm}
              onOrderCreated={handleOrderCreated}
            />
            
            <UserOrdersList 
              orders={Array.isArray(userOrders) ? userOrders : []}
              loading={ordersLoading}
              error={ordersError}
            />
          </TabsContent>

          <TabsContent value="selected-specialists" className="mt-0 bg-white p-6 rounded-lg">
            <SelectedSpecialistsTab 
              specialists={workingSpecialists}
              loading={specialistsLoading}
            />
          </TabsContent>

          <TabsContent value="order-history" className="mt-0 bg-white p-6 rounded-lg">
                        <AllOrdersTab 
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  )
}
