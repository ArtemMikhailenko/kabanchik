'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'

interface Order {
  id: string
  title: string
  description: string
  category: string
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Не удалось загрузить заказы')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Открыт'
      case 'IN_PROGRESS':
        return 'В работе'
      case 'COMPLETED':
        return 'Завершен'
      case 'CANCELLED':
        return 'Отменен'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Загрузка заказов...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Мои заказы
          </h1>
          <Link href="/order/create">
            <Button className="bg-[#55c4c8] hover:bg-[#4ab3b7] text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Создать заказ
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <Button 
              onClick={fetchOrders}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white"
            >
              Попробовать снова
            </Button>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                У вас пока нет заказов
              </h2>
              <p className="text-gray-600 mb-6">
                Создайте свой первый заказ, чтобы найти специалиста для выполнения работы.
              </p>
              <Link href="/order/create">
                <Button className="bg-[#55c4c8] hover:bg-[#4ab3b7] text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Создать первый заказ
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {order.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {order.description && order.description.length > 200 
                          ? `${order.description.substring(0, 200)}...` 
                          : (order.description || 'Нет описания')
                        }
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Категория: {order.category}</span>
                        <span>•</span>
                        <span>Создан: {formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/order/${order.id}`}>
                        <Button 
                          variant="outline"
                          className="border-[#55c4c8] text-[#55c4c8] hover:bg-[#55c4c8] hover:text-white"
                        >
                          Просмотреть
                        </Button>
                      </Link>
                      {order.status === 'OPEN' && (
                        <Button 
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            // Логика для редактирования заказа
                            window.location.href = `/order/create?title=${encodeURIComponent(order.title)}&description=${encodeURIComponent(order.description)}`
                          }}
                        >
                          Редактировать
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-[#55c4c8] mb-1">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Всего заказов</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {orders.filter(o => o.status === 'OPEN').length}
              </div>
              <div className="text-sm text-gray-600">Открытых</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {orders.filter(o => o.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-sm text-gray-600">В работе</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {orders.filter(o => o.status === 'COMPLETED').length}
              </div>
              <div className="text-sm text-gray-600">Завершенных</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
