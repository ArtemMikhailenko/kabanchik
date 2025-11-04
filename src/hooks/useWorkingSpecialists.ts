import { useState, useEffect } from 'react'

interface Order {
  id: string
  title: string
  categoryName: string
  budget: number | null
  createdAt: string
}

interface WorkingSpecialist {
  id: string
  userId: string
  name: string
  avatar: string
  bio?: string | null
  rating: number
  reviewCount: number
  categories: string[]
  orders: Order[]
}

export function useWorkingSpecialists() {
  const [specialists, setSpecialists] = useState<WorkingSpecialist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSpecialists = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/specialists/working')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch specialists')
      }

      console.log('Working specialists fetched:', data.specialists)
      setSpecialists(data.specialists || [])
    } catch (err) {
      console.error('Error fetching working specialists:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSpecialists([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpecialists()
  }, [])

  return {
    specialists,
    loading,
    error,
    refetch: fetchSpecialists
  }
}
