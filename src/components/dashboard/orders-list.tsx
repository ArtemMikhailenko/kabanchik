// src/components/dashboard/orders-list.tsx
'use client'

import React from 'react'
import { OrderCard } from './order-card'
import { DashboardPagination } from './pagination'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface OrdersListOrder {
  id: string
  title: string
  description: string
  budget: number | null
  location: string | null
  status: string
  createdAt: string
  category: {
    id: string
    name: string
    slug: string
  }
  customer: {
    id: string
    user: {
      id: string
      name: string | null
      avatar: string | null
    }
  }
  specialist: {
    id: string
    user: {
      id: string
      name: string | null
      avatar: string | null
    }
  } | null
  responsesCount: number
}

interface OrdersListProps {
  orders: OrdersListOrder[]
  categoryName: string
  currentPage: number
  totalPages: number
  isLoading?: boolean
  onPageChange: (page: number) => void
  onBackToCategories: () => void
  onOrderAction?: (orderId: string) => void
}

export function OrdersList({
  orders,
  categoryName,
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
  onBackToCategories,
  onOrderAction
}: OrdersListProps) {
  // Transform orders to match the OrderCard interface
  const transformedOrders = orders.map(order => ({
    id: order.id,
    title: order.title,
    clientName: order.customer.user.name || 'Anonymous',
    clientAvatar: order.customer.user.avatar || '',
    location: order.location || 'Not specified',
    deadline: new Date(order.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    status: order.status.toLowerCase() as 'waiting' | 'in-progress' | 'completed' | 'review' | 'suggested' | 'pending-acceptance',
    statusText: getStatusText(order.status, order.responsesCount)
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onBackToCategories}
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Button>
        <h2 className="text-2xl font-bold text-[#282a35]">
          {categoryName} Orders ({orders.length})
        </h2>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-xl text-gray-600 mb-2">No orders found</div>
            <div className="text-sm text-gray-500">
              There are no orders in this category yet.
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {transformedOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAction={onOrderAction}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

function getStatusText(status: string, responsesCount: number): string {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return responsesCount > 0 ? `${responsesCount} responses` : 'No responses yet'
    case 'IN_PROGRESS':
      return 'In progress'
    case 'COMPLETED':
      return 'Completed'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return 'Unknown status'
  }
}