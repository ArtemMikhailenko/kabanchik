'use client'

import { Suspense } from 'react'

import React, { useState, useEffect } from 'react'
import { SearchResultsHeader } from '@/components/search/search-results-header'
import { FilterTabs } from '@/components/search/filter-tabs'
import { SpecialistCard } from '@/components/specialists/specialist-card'
import { DashboardPagination } from '@/components/dashboard/pagination'
import FAQSection from '@/components/landing/FAQ'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSpecialistSearch } from '@/hooks/useSpecialistSearch'

interface Filter {
  id: string
  label: string
}

function SearchResultsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  
  // Получаем параметры поиска
  const service = searchParams.get('service') || ''
  const city = searchParams.get('city') || ''
  const date = searchParams.get('date') || ''
  const description = searchParams.get('description') || ''

  // Используем хук для поиска специалистов
  const { data, loading, error, refetch } = useSpecialistSearch({
    service,
    city,
    page: currentPage,
    limit: 10
  })

  // Создаем фильтры на основе параметров поиска
  const createActiveFilters = (): Filter[] => {
    const filters: Filter[] = []
    
    if (service) {
      filters.push({ id: 'service', label: service })
    }
    
    if (city) {
      filters.push({ id: 'city', label: city })
    }
    
    if (date) {
      filters.push({ id: 'date', label: date })
    }
    
    return filters
  }

  const [activeFilters, setActiveFilters] = useState<Filter[]>(createActiveFilters())

  // Обновляем фильтры при изменении параметров поиска
  useEffect(() => {
    setActiveFilters(createActiveFilters())
  }, [service, city, date])

  // Обновляем поиск при изменении параметров
  useEffect(() => {
    refetch({ 
      service,
      city,
      page: currentPage
    })
  }, [service, city, currentPage])

  const handleFilterRemove = (filterId: string) => {
    // Создаем новые параметры поиска без удаленного фильтра
    const params = new URLSearchParams(searchParams.toString())
    
    if (filterId === 'service') {
      params.delete('service')
    } else if (filterId === 'city') {
      params.delete('city')
    } else if (filterId === 'date') {
      params.delete('date')
    }
    
    // Обновляем URL и фильтры
    router.push(`/search/results?${params.toString()}`)
    setActiveFilters(prev => prev.filter(filter => filter.id !== filterId))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    refetch({ page })
  }

  const specialists = data?.specialists || []
  const totalPages = data?.pagination.totalPages || 1
  const totalCount = data?.pagination.totalCount || 0

  const handleJobOffer = (specialistId: string) => {
    router.push(`/order/create/${specialistId}`)
  }

  const handleLearnMore = (specialistId: string) => {
    router.push(`/specialists/${specialistId}`)
  }

  return (
    <main className="min-h-screen bg-white">
      <SearchResultsHeader
        category={service || 'All Categories'}
        description="Lorem ipsum dolor sit amet consectetur adipiscing elit tortor eu dolorol egestas morbi sem vulputate etiam facilisis pellentesque ut quis."
        activeFilters={activeFilters}
        onFilterRemove={handleFilterRemove}
      />

      <section className="pt-6">
        <div className="max-w-[1200px] mx-auto px-6">
          <FilterTabs 
            filters={activeFilters}
            onRemoveFilter={handleFilterRemove}
          />
        </div>
      </section>

      <section className="pt-6 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-gray-600">Searching for specialists...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-red-600">Error: {error}</div>
            </div>
          )}

          {!loading && !error && specialists.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-gray-600">No specialists found. Try adjusting your search criteria.</div>
            </div>
          )}

          {!loading && !error && specialists.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-gray-600">Found {totalCount} specialists</p>
              </div>
              
              <div className="mx-auto space-y-6">
                {specialists.map((specialist) => (
                  <SpecialistCard
                    key={specialist.id}
                    specialist={specialist}
                    onJobOffer={handleJobOffer}
                    onLearnMore={handleLearnMore}
                  />
                ))}
              </div>

              <div className="mt-12">
                <DashboardPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <FAQSection 
        backgroundColor="bg-[#55c4c8]"
        showTitle={true}
      />
    </main>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsPageContent />
    </Suspense>
  )
}
