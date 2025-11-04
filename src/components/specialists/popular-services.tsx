'use client'

import React, { useState, useEffect } from 'react'

interface PopularService {
  id: string
  name: string
  slug: string
  orderCount: number
  iconColor: string
}

interface PopularServicesProps {
  categorySlug: string | null
}

export default function PopularServices({ categorySlug }: PopularServicesProps) {
  const [services, setServices] = useState<PopularService[]>([])
  const [loading, setLoading] = useState(false)
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    const fetchPopularServices = async () => {
      if (!categorySlug) return

      try {
        setLoading(true)
        const response = await fetch(`/api/categories/popular/${categorySlug}`)
        if (response.ok) {
          const data = await response.json()
          setServices(data.popularServices)
          setCategoryName(data.parentCategory.name)
        }
      } catch (error) {
        console.error('Error fetching popular services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularServices()
  }, [categorySlug])

  if (!categorySlug || loading || services.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[32px] font-bold text-[#282a35] mb-8">
          Популярні послуги в категорії "{categoryName}"
        </h2>
        
        <div className="grid grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className="w-[281px] h-[68px] bg-white border border-[#e6e6e6] rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => {
                // Navigate to search results for this service
                window.location.href = `/search?service=${encodeURIComponent(service.name)}`
              }}
            >
              <div className="flex items-center gap-3">
                {/* Service Icon */}
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#d4f4f4' }}
                >
                  <span className="text-[#55c4c8] text-lg">🔧</span>
                </div>
                
                {/* Service Name */}
                <h3 className="text-[#282a35] font-medium text-base leading-[22px] group-hover:text-[#55c4c8] transition-colors truncate">
                  {service.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}