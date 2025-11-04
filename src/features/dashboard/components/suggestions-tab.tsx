// src/features/profile/components/suggestions-tab.tsx
'use client'

import React, { useState } from 'react'
import { OrderCard, type Order } from '@/components/dashboard/order-card'
import { DashboardPagination } from '@/components/dashboard/pagination'

interface Filter {
  id: string
  label: string
}

interface SuggestionsTabProps {
  orders?: Order[]
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onOrderAction?: (orderId: string) => void
}

export function SuggestionsTab({ 
  orders = [],
  currentPage = 2,
  totalPages = 15,
  onPageChange = () => {},
  onOrderAction = () => {}
}: SuggestionsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('categories')
  const [activeFilters, setActiveFilters] = useState<Filter[]>([
    { id: '1', label: 'Filter name' },
    { id: '2', label: 'Filter name' }
  ])

  const handleFilterRemove = (filterId: string) => {
    setActiveFilters(prev => prev.filter(filter => filter.id !== filterId))
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    // Здесь будет логика фильтрации заказов
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // Здесь будет логика фильтрации по категориям
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1114px] mx-auto">
      {/* Filters Section */}
      <div className="w-full h-[88px] bg-[#f7f7f7] rounded-2xl px-9 py-5">
        <div className="flex justify-between items-center h-full">
          {/* Categories Dropdown */}
          <div className="w-[279px] h-12 bg-white rounded-[40px] px-5 py-3 flex items-center justify-between">
            <span className="text-[#282a35] text-base font-normal">Categories</span>
            <div className="w-4 h-4">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#282a35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Filter Pills */}
          <div className="flex items-center gap-4">
            {activeFilters.map((filter) => (
              <div 
                key={filter.id} 
                className="h-[29px] px-3 py-2 border border-[#646464] rounded-[40px] flex items-center gap-2.5"
              >
                <span className="text-[#646464] text-xs font-normal">{filter.label}</span>
                <button 
                  onClick={() => handleFilterRemove(filter.id)}
                  className="w-3 h-3 flex items-center justify-center"
                >
                  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3.5L3 9.5M3 3.5L9 9.5" stroke="#646464" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-[1113px] h-[52px] bg-white border border-[#d8d6d6] rounded-[60px] px-[22px] py-[14px] mx-auto">
        <div className="flex items-center gap-4 h-6">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="#646464" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="#646464" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 text-sm text-[#a3a3a3] bg-transparent border-none outline-none placeholder-[#a3a3a3]"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-8 px-0">
        {orders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onAction={onOrderAction}
          />
        ))}
        
        <div className="flex justify-center pt-6">
          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  )
}