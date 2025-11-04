'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CategoryItemProps {
  icon?: React.ReactNode
  title: string
  services: string[]
  iconColor?: string
  slug?: string
}

export function CategoryItem({ 
  icon, 
  title, 
  services, 
  iconColor = "#34979a",
  slug 
}: CategoryItemProps) {
  const [showAll, setShowAll] = useState(false)
  const router = useRouter()
  
  const displayedServices = showAll ? services : services.slice(0, 8)
  const hasMoreServices = services.length > 8

  const handleCategoryClick = () => {
    // Переход на страницу поиска с выбранной категорией
    const searchParams = new URLSearchParams()
    searchParams.set('service', title)
    router.push(`/search/results?${searchParams.toString()}`)
  }

  const handleServiceClick = (service: string, event: React.MouseEvent) => {
    // Предотвращаем всплытие события
    event.stopPropagation()
    
    // Переход на страницу поиска с выбранной подкатегорией
    const searchParams = new URLSearchParams()
    searchParams.set('service', service)
    router.push(`/search/results?${searchParams.toString()}`)
  }

  return (
    <div className="w-full max-w-[384px] min-h-[396px] flex flex-col gap-5">
      {/* Header with icon and title - clickable */}
      <div 
        className="flex items-center gap-5 h-16 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleCategoryClick}
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconColor + '20' }}
        >
          {icon || (
            <img
            src="/tools.svg" 
              
             
            />
          )}
        </div>
        <h3 className="text-2xl font-bold text-[#282a35] leading-[110%]">
          {title}
        </h3>
      </div>

      {/* Services list */}
      <div className="flex flex-col gap-3 flex-1">
        {displayedServices.map((service, index) => (
          <div 
            key={index} 
            className="text-base text-[#282a35] leading-[150%] min-h-[24px] cursor-pointer hover:text-[#34979a] transition-colors"
            onClick={(e) => handleServiceClick(service, e)}
          >
            • {service}
          </div>
        ))}
        
        {hasMoreServices && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-base font-medium text-[#34979a] leading-[150%] text-left min-h-[24px] hover:underline transition-colors"
          >
            {showAll ? 'show less' : 'show more'}
          </button>
        )}
      </div>
    </div>
  )
}
