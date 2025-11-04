'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin } from 'lucide-react'

export interface Order {
  id: string
  title: string
  clientName: string
  clientAvatar: string
  location: string
  deadline: string
  status: 'waiting' | 'in-progress' | 'completed' | 'review' | 'suggested' | 'pending-acceptance'
  statusText: string
  // Добавляем информацию о том, какая роль у пользователя и контекст
  userRole?: 'SPECIALIST' | 'CUSTOMER'
  actionType?: 'view' | 'accept' | 'complete' | 'review'
}

interface OrderCardProps {
  order: Order
  onAction?: (orderId: string) => void
}

export function OrderCard({ order, onAction }: OrderCardProps) {
  // Shorten location to city (first comma-separated token) to match mock
  const shortLocation = (order.location || '').split(',')[0]?.trim() || order.location
  // Определяем текст кнопки в зависимости от статуса и контекста
  const getButtonText = () => {
    switch (order.status) {
      case 'suggested':
        return 'review'
      case 'in-progress':
        return 'View Details'
      case 'completed':
        return 'Review'
      case 'waiting':
        return 'View'
      default:
        return 'View'
    }
  }

  // Определяем цвет кнопки в зависимости от статуса
  const getButtonStyle = () => {
    switch (order.status) {
      case 'suggested':
        return 'bg-[#55c4c8] hover:bg-[#4ab3b7] text-[#282a35]'
      case 'in-progress':
        return 'bg-[#55c4c8] hover:bg-[#4ab3b7] text-[#282a35]'
      case 'completed':
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      default:
        return 'bg-[#55c4c8] hover:bg-[#4ab3b7] text-[#282a35]'
    }
  }

  return (
    <div className="w-full h-[155px] bg-white border border-[#e6e6e6] rounded-[24px] px-6 py-4 flex items-center justify-between">
      {/* Left Section - Order Info */}
      <div className="flex items-end gap-[72px] flex-1">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-6">
          <Avatar className="w-20 h-20 flex-shrink-0">
            <AvatarImage src={order.clientAvatar} alt={order.clientName} />
            <AvatarFallback className="text-lg">
              {(order.clientName || 'U').split(' ').map(n => n?.[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col gap-[22px]">
            {/* Order Title */}
            <h3 className="text-2xl font-bold text-[#282a35] leading-[150%]">
              {order.title}
            </h3>
            
            {/* Client Name and Location */}
            <div className="flex items-end gap-3">
              <span className="text-sm font-medium text-[#282a35] leading-[130%]">
                {order.clientName}
              </span>
              <div className="flex items-end gap-0">
                <MapPin className="w-6 h-6 text-[#a3a3a3]" />
                <span className="text-sm text-[#a3a3a3] leading-[150%]">
                  {shortLocation}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Deadline */}
        <div className="flex items-end">
          <span className="text-sm text-[#a3a3a3] leading-[150%]">
            {order.deadline}
          </span>
        </div>
        
        {/* Status */}
        <div className="flex items-end">
          <span className="text-sm text-[#55c4c8] leading-[150%]">
            {order.statusText}
          </span>
        </div>
      </div>
      
      {/* Right Section - Action Button */}
      <div className="flex items-center">
        <Button 
          className={`w-[200px] h-[51px] rounded-[50px] px-9 py-4 text-base font-medium leading-[120%] ${getButtonStyle()}`}
          onClick={() => onAction?.(order.id)}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  )
}