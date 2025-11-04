import { useState, useEffect } from 'react'

export interface SearchFilters {
  service?: string
  city?: string
  date?: string
  description?: string
  page?: number
  limit?: number
}

export interface Specialist {
  id: string
  name: string
  title: string
  avatar: string
  rating: number
  reviewsCount: number
  positivePercentage: number
  description: string
  isVerified: boolean
  isCustomerSafe: boolean
  skills?: string[]
  categories?: string[]
  hourlyRate?: number | null
  availability?: string | null
}

export interface SearchResponse {
  specialists: Specialist[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  filters: {
    service?: string
    city?: string
  }
}

export const useSpecialistSearch = (filters: SearchFilters) => {
  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchSpecialists = async (searchFilters: SearchFilters) => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      if (searchFilters.service) searchParams.set('service', searchFilters.service)
      if (searchFilters.city) searchParams.set('city', searchFilters.city)
      if (searchFilters.page) searchParams.set('page', searchFilters.page.toString())
      if (searchFilters.limit) searchParams.set('limit', searchFilters.limit.toString())

      const response = await fetch(`/api/specialists/search?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search specialists')
      console.error('Error searching specialists:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchSpecialists(filters)
  }, [filters.service, filters.city, filters.page])

  const refetch = (newFilters?: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    searchSpecialists(updatedFilters)
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}
