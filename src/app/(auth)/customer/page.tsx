'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  TabNavigation,
  CreateOrderForm,
  PopularOrderCard,
  SpecialistCard,
  Pagination,
  SpecialistProfile,
  OrderFilters,
  WorkOrderCard,
  OrderHistoryCard
} from '@/components/customer'

// Mock data
const specialistData = {
  name: 'Lewis Greyson',
  avatar: '/photo.png',
  location: 'Kyiv',
  reviews: 456,
  positiveRating: 99,
  tariffPlan: {
    name: 'Unlimited',
    validUntil: '12 December 2024'
  }
}

const testimonials = [
  {
    id: 1,
    text: 'Lorem ipsum dolor sit amet consectetur. Cursus urna blandit leo cras consequat.'
  },
  {
    id: 2,
    text: 'Lorem ipsum dolor sit amet consectetur. Cursus urna blandit leo cras consequat.'
  },
  {
    id: 3,
    text: 'Lorem ipsum dolor sit amet consectetur. Cursus urna blandit leo cras consequat.'
  }
]

const ordersData = [
  {
    id: '1',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '2',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '3',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  }
]

const workOrdersData = [
  {
    id: '1',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '2',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '3',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '4',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '5',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '6',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '7',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  }
]

const orderHistoryData = [
  {
    id: '1',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '2',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '3',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '4',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '5',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '6',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  },
  {
    id: '7',
    title: 'Name of the order',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'Waiting for a specialist'
  }
]

const specialistsList = [
  { id: 1, name: 'Specialist 1' },
  { id: 2, name: 'Specialist 2' },
  { id: 3, name: 'Specialist 3' },
  { id: 4, name: 'Specialist 4' },
  { id: 5, name: 'Specialist 5' }
]

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState('new-order')
  const [orderFormExpanded, setOrderFormExpanded] = useState(false)

  const handleOrderReview = (orderId: string) => {
    console.log('Review order:', orderId)
    // Переход на страницу заказа в приватной зоне
    window.location.href = `/order/${orderId}`
  }

  const handleJobOffer = (specialistId: number) => {
    console.log('Job offer to specialist:', specialistId)
    // Здесь будет логика для отправки предложения о работе
  }

  const handlePageChange = (page: number) => {
    console.log('Change to page:', page)
    // Здесь будет логика для смены страницы
  }

  const handleFilterRemove = (filter: string) => {
    console.log('Remove filter:', filter)
    // Здесь будет логика для удаления фильтра
  }

  const handleOrderClose = (orderId: string) => {
    console.log('Close order:', orderId)
    // Здесь будет логика для закрытия заказа
  }

  const handleOrderRepeat = async (orderId: string) => {
    try {
      console.log('Repeat order:', orderId)
      
      // Получаем данные оригинального заказа
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }
      
      const orderData = await response.json()
      
      // Перенаправляем на страницу создания заказа с предзаполненными данными
      const queryParams = new URLSearchParams({
        title: orderData.title || '',
        description: orderData.description || '',
        location: orderData.location || '',
        specialistId: orderData.specialistId || ''
      })
      
      // Если есть specialistId, перенаправляем на страницу создания заказа для конкретного специалиста
      if (orderData.specialistId) {
        window.location.href = `/order/create/${orderData.specialistId}?${queryParams.toString()}`
      } else {
        // Иначе на общую страницу создания заказа
        window.location.href = `/order/create?${queryParams.toString()}`
      }
    } catch (error) {
      console.error('Error repeating order:', error)
      alert('Не удалось повторить заказ. Попробуйте еще раз.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Specialist Profile */}
        <SpecialistProfile specialist={specialistData} testimonials={testimonials} />

        <div className='bg-white rounded-2xl p-9 mb-12'>
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content based on active tab */}
        {activeTab === 'new-order' && (
          <div>
            {/* Create Order Form */}
            <CreateOrderForm 
              isExpanded={orderFormExpanded} 
              onToggleExpand={() => setOrderFormExpanded(!orderFormExpanded)}
            />

            {/* Popular Orders */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#282a35] opacity-80 mb-6">Popular orders</h2>
              {ordersData.map((order, index) => (
                <PopularOrderCard 
                  key={order.id} 
                  order={order} 
                  index={index} 
                  onReview={handleOrderReview}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination onPageChange={handlePageChange} />
          </div>
        )}

        {/* At Work Tab */}
        {activeTab === 'at-work' && (
          <div>
            {/* Order Filters */}
            <OrderFilters onFilterRemove={handleFilterRemove} />

            {/* Work Orders */}
            <div className="mb-8">
              {workOrdersData.map((order, index) => (
                <WorkOrderCard 
                  key={order.id} 
                  order={order} 
                  index={index} 
                  onReview={handleOrderReview}
                  onClose={handleOrderClose}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination onPageChange={handlePageChange} />
          </div>
        )}

        {/* Selected Specialists Tab */}
        {activeTab === 'selected-specialists' && (
          <div>
            {/* List of Specialists */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#282a35] opacity-80 mb-6">Selected specialists</h2>
              {specialistsList.map((specialist) => (
                <SpecialistCard 
                  key={specialist.id} 
                  specialist={specialist} 
                  onJobOffer={handleJobOffer}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination onPageChange={handlePageChange} />
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'order-history' && (
          <div>
            {/* Order History */}
            <div className="mb-8">
              {orderHistoryData.map((order, index) => (
                <OrderHistoryCard 
                  key={order.id} 
                  order={order} 
                  index={index} 
                  onReview={handleOrderReview}
                  onRepeat={handleOrderRepeat}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination onPageChange={handlePageChange} />
          </div>
        )}
        </div>
        
      </div>
    </div>
  )
}
