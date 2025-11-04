'use client'

import React from 'react'

interface CategoryCardProps {
  name: string
  ordersCount: number
  isSelected?: boolean
  onClick?: () => void
}

export function CategoryCard({ 
  name, 
  ordersCount, 
  isSelected = false, 
  onClick 
}: CategoryCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        w-[276px] h-[91px] rounded-2xl border cursor-pointer transition-all duration-200 p-5 flex items-start gap-[13px]
        ${isSelected 
          ? 'bg-[#d4f4f4] border-[#d4f4f4] shadow-[3px_4px_11px_rgba(30,81,83,0.1),13px_15px_20px_rgba(30,81,83,0.09),30px_34px_27px_rgba(30,81,83,0.05),53px_61px_32px_rgba(30,81,83,0.01),83px_95px_35px_rgba(30,81,83,0)]' 
          : 'bg-white border-[#d8d6d6]'
        }
      `}
    >
      {/* Icon Circle */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center
        ${isSelected ? 'bg-[#55c4c8]' : 'bg-[#d4f4f4]'}
      `}>
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" 
            fill={isSelected ? "white" : "#55c4c8"} 
          />
        </svg>
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-[#282a35] text-base font-medium leading-[140%]">
          {name}
        </h3>
        <p className="text-[#a3a3a3] text-sm font-normal leading-[150%]">
          {ordersCount} orders
        </p>
      </div>
    </div>
  )
}