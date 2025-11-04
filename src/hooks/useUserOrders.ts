import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import type { Order } from '@/components/dashboard/order-card'

export interface UserOrder {
  id: string
  title: string
  description: string
  category: string
  status: string
  createdAt: string
}

export interface UserOrdersData {
  atWorkOrders: Order[]
  allOrders: Order[]
  suggestions: Order[]
  isLoading: boolean
  error: string | null
  pagination: {
    atWorkTotalPages: number
    suggestionsTotalPages: number
    allOrdersTotalPages: number
    itemsPerPage: number
  }
}

export const useUserOrders = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!isLoaded || !isSignedIn) {
        setError('User not authenticated')
        return
      }

      console.log('Fetching orders for authenticated user')
      
      // Get the token to include in the request
      const token = await getToken()
      console.log('Got token:', !!token)

      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      
      if (!response.ok) {
        // Graceful fallbacks for common statuses
        if (response.status === 401) {
          setOrders([])
          setError('Unauthorized')
          return
        }
        if (response.status === 404) {
          setOrders([])
          return
        }
        // For 5xx or other errors, log and return empty orders instead of throwing
        let details = ''
        try { details = JSON.stringify(await response.json()) } catch {}
        console.error(`useUserOrders fetchOrders failed: ${response.status} ${details}`)
        setOrders([])
        return
      }

      const data = await response.json()
      console.log('Orders data from API:', data)
      console.log('Orders array:', data.orders)
      console.log('Orders count:', data.orders?.length || 0)
      console.log('Total from API:', data.total)
      setOrders(data.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      fetchOrders()
    }
  }, [isLoaded, isSignedIn])

  const refetchOrders = () => {
    fetchOrders()
  }

  return {
    orders,
    loading,
    error,
    refetchOrders
  }
}

// Новый хук для dashboard заказов
export const useUserOrdersForDashboard = (): UserOrdersData => {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const [data, setData] = useState<UserOrdersData>({
    atWorkOrders: [],
    allOrders: [],
    suggestions: [],
    isLoading: true,
    error: null,
    pagination: {
      atWorkTotalPages: 1,
      suggestionsTotalPages: 1,
      allOrdersTotalPages: 1,
      itemsPerPage: 6
    }
  })

  const fetchOrdersByType = async (type: string): Promise<Order[]> => {
    try {
      if (!isLoaded || !isSignedIn) {
        console.log(`fetchOrdersByType(${type}): User not authenticated`)
        return []
      }

      console.log(`fetchOrdersByType(${type}): Fetching...`)
      const token = await getToken()
      const response = await fetch(`/api/orders?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      console.log(`fetchOrdersByType(${type}): Response status: ${response.status}`)

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          return []
        }
        // Не валим дашборд из-за 5xx — логируем и возвращаем пусто
        let details = ''
        try { details = JSON.stringify(await response.json()) } catch {}
        console.error(`fetchOrdersByType(${type}) failed: ${response.status} ${details}`)
        return []
      }

      const data = await response.json()
      console.log(`fetchOrdersByType(${type}): Received data:`, data)
      console.log(`fetchOrdersByType(${type}): Orders array:`, data.orders)
      console.log(`fetchOrdersByType(${type}): Orders count:`, data.orders?.length || 0)
      return data.orders || []
    } catch (error) {
      console.error(`Error fetching ${type} orders:`, error)
      return []
    }
  }

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (!isLoaded || !isSignedIn) {
        setData(prev => ({ ...prev, isLoading: false, error: 'User not authenticated' }))
        return
      }

      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }))

        // Загружаем все типы заказов параллельно
        const [atWorkOrders, suggestions, allOrders] = await Promise.all([
          fetchOrdersByType('at-work'),
          fetchOrdersByType('suggestions'),
          fetchOrdersByType('all')
        ])

        console.log('Orders fetched:', {
          atWork: atWorkOrders.length,
          suggestions: suggestions.length,
          all: allOrders.length
        })

        // Рассчитываем пагинацию
        const itemsPerPage = 6
        const atWorkTotalPages = Math.max(1, Math.ceil(atWorkOrders.length / itemsPerPage))
        const suggestionsTotalPages = Math.max(1, Math.ceil(suggestions.length / itemsPerPage))
        const allOrdersTotalPages = Math.max(1, Math.ceil(allOrders.length / itemsPerPage))

        setData({
          atWorkOrders,
          allOrders,
          suggestions,
          isLoading: false,
          error: null,
          pagination: {
            atWorkTotalPages,
            suggestionsTotalPages,
            allOrdersTotalPages,
            itemsPerPage
          }
        })

      } catch (error) {
        console.error('Error fetching orders:', error)
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch orders'
        }))
      }
    }

    fetchAllOrders()
  }, [isLoaded, isSignedIn, getToken])

  return data
}
