'use client'

import React from 'react'
import { OrderCard, type Order } from '@/components/dashboard/order-card'
import { DashboardPagination } from '@/components/dashboard/pagination'

interface AtWorkTabProps {
  orders: Order[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onOrderAction: (orderId: string) => void
}

export function AtWorkTab({ 
  orders, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onOrderAction 
}: AtWorkTabProps) {
  return (
    <div className="w-full mx-auto">
      {/* Orders List - Vertical stack with gaps */}
      <div className="flex flex-col gap-8 mx-auto">
        {orders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onAction={onOrderAction}
          />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-12">
        <DashboardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}

