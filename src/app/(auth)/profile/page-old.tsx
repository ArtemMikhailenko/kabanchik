'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileHeader } from '@/components/profile/profile-header'
import { AtWorkTab } from '@/features/dashboard/components/at-work-tab'
import { AllOrdersTab } from '@/features/dashboard/components/all-orders-tab'
import type { Order } from '@/components/dashboard/order-card'

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
  },
  email: '123456@gmail.com',
  city: 'Kyiv',
  birthDate: '16.09.1981',
  about: `Lorem ipsum dolor sit amet consectetur. Cursus urna blandit leo oras consequat. Amet suspendisse suspendisse sed tortor sollicitudin non placerat arcu. Porta suscipit dictumst iaculis leo risus velit fringilla faucibus commodo. In risus sed ac vitae blandit. Ipsum tortor velit quam tincidunt netus sed elefend quisque. Quis pretium sit morbi aliquet consectetur. Ipsum tristique bibendum tortor platea vulputate.

Venenatis at pretium diam donec etiam platea tincidunt vulputate duis. Feugiat non quisque eget ullamcorper in sed elementum tellus. At interdum vivamus auctor magna commodo pellentesque quisque. Nunc felis congue r...`,
  orders: [
    'Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet',
    'Lorem ipsum dolor sit amet'
  ],
  notifications: Array(12).fill('Mailing of new orders')
}

const mockPortfolioItems = [
  { id: 1, image: '/photo.png', tags: ['tag name', 'tag name', 'tag name'] },
  { id: 2, image: '/photo.png', tags: ['tag name', 'tag name', 'tag name'] },
  { id: 3, image: '/photo.png', tags: ['tag name', 'tag name', 'tag name'] },
  { id: 4, image: '/photo.png', tags: ['tag name', 'tag name', 'tag name'] },
  { id: 5, image: '/photo.png', tags: ['tag name', 'tag name', 'tag name'] },
  { id: 6, image: '/photo.png', tags: ['tag name', 'tag name', 'tag name'] },
  { id: 7, image: '/photo.png', tags: ['tag name', 'tag name', 'tag name'] },
  { id: 8, image: '/photo.png', tags: ['tag name', 'tag name', 'tag name'] }
]

const mockOrders: Order[] = [
  {
    id: '1',
    title: 'Name of the order',
    clientName: 'Matt Cannon',
    clientAvatar: '/photo.png',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'waiting',
    statusText: 'Waiting for a specialist'
  },
  {
    id: '2',
    title: 'Name of the order',
    clientName: 'Matt Cannon',
    clientAvatar: '/photo.png',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'waiting',
    statusText: 'Waiting for a specialist'
  },
  {
    id: '3',
    title: 'Name of the order',
    clientName: 'Matt Cannon',
    clientAvatar: '/photo.png',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'waiting',
    statusText: 'Waiting for a specialist'
  },
  {
    id: '4',
    title: 'Name of the order',
    clientName: 'Matt Cannon',
    clientAvatar: '/photo.png',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'waiting',
    statusText: 'Waiting for a specialist'
  },
  {
    id: '5',
    title: 'Name of the order',
    clientName: 'Matt Cannon',
    clientAvatar: '/photo.png',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'waiting',
    statusText: 'Waiting for a specialist'
  },
  {
    id: '6',
    title: 'Name of the order',
    clientName: 'Matt Cannon',
    clientAvatar: '/photo.png',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'waiting',
    statusText: 'Waiting for a specialist'
  }
]

// Дополнительные заказы для показа
const additionalOrders: Order[] = [
  {
    id: '1',
    title: 'Name of the order',
    clientName: 'Matt Cannon',
    clientAvatar: '/photo.png',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'waiting',
    statusText: 'Waiting for a specialist'
  },
  {
    id: '2',
    title: 'Name of the order',
    clientName: 'Matt Cannon',
    clientAvatar: '/photo.png',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'waiting',
    statusText: 'Waiting for a specialist'
  },
  {
    id: '3',
    title: 'Name of the order',
    clientName: 'Matt Cannon',
    clientAvatar: '/photo.png',
    location: 'Kyiv',
    deadline: 'To be completed by December 08',
    status: 'waiting',
    statusText: 'Waiting for a specialist'
  }
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('at-work')
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 15

  const handleOrderAction = (orderId: string) => {
    console.log('Order action for:', orderId)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <ProfileHeader user={mockUser} />

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
            <AtWorkTab 
              orders={[...mockOrders, ...additionalOrders]}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onOrderAction={handleOrderAction}
            />
          </TabsContent>

          <TabsContent value="new-order" className="mt-0 bg-white p-6 rounded-lg">
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">New Order</h3>
              <p className="text-gray-600">Create a new order functionality will be implemented here.</p>
            </div>
          </TabsContent>

          <TabsContent value="selected-specialists" className="mt-0 bg-white p-6 rounded-lg">
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">Selected Specialists</h3>
              <p className="text-gray-600">View and manage your selected specialists here.</p>
            </div>
          </TabsContent>

          <TabsContent value="order-history" className="mt-0 bg-white p-6 rounded-lg">
            <AllOrdersTab 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
