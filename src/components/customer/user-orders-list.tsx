'use client'

import React from 'react'
import { OrderCard } from '@/components/dashboard/order-card'
import type { Order } from '@/components/dashboard/order-card'
import type { UserOrder } from '@/hooks/useUserOrders'

interface UserOrdersListProps {
  orders: UserOrder[]
  loading: boolean
  error: string | null
}

// Function to transform UserOrder to Order format expected by OrderCard
const transformUserOrderToOrder = (userOrder: UserOrder): Order => {
  return {
    id: userOrder.id,
    title: userOrder.title,
    clientName: 'You', // Since it's user's own order
    clientAvatar: '/photo.png', // Default avatar
    location: 'Kyiv', // Default location, could be dynamic
    deadline: `Created: ${formatDate(userOrder.createdAt)}`,
    status: transformStatus(userOrder.status),
    statusText: formatStatusText(userOrder.status)
  }
}

const transformStatus = (status: string): Order['status'] => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'waiting'
    case 'in_progress':
      return 'in-progress'
    case 'completed':
      return 'completed'
    case 'cancelled':
      return 'review'
    default:
      return 'waiting'
  }
}

const formatStatusText = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'Waiting for a specialist'
    case 'in_progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    default:
      return 'Unknown Status'
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

export const UserOrdersList = ({ orders, loading, error }: UserOrdersListProps) => {
  console.log('UserOrdersList received orders:', orders)

  const handleOrderAction = (orderId: string) => {
    console.log('Order action for:', orderId)
    // Here you could navigate to order details or open a modal
  }
  
  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold text-[#282a35] mb-4">Your Orders</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading your orders...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold text-[#282a35] mb-4">Your Orders</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error loading orders: {error}</div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold text-[#282a35] mb-4">Your Orders</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">No orders found. Create your first order above!</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-[#282a35] mb-4">Your Orders ({orders.length})</h3>
      <div className="space-y-4">
        {orders.map((userOrder) => {
          const order = transformUserOrderToOrder(userOrder)
          return (
            <OrderCard
              key={order.id}
              order={order}
              onAction={handleOrderAction}
            />
          )
        })}
      </div>
    </div>
  )
}
