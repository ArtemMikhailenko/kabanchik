'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Loader2, Eye, ChevronDown, Clock, Info, CheckSquare, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { OrderCompletionSection } from '@/components/customer/order-completion-section'

interface OrderData {
  id: string
  title: string
  description: string
  location?: string | null
  category: string
  status: string
  rawStatus?: string
  createdAt: string
  updatedAt?: string
  views: number
  orderNumber: string
  performDate?: string
  whatToExpect?: string
  expectations?: string | null
  confidentialInfo?: string
  customer: {
    name: string
    avatar: string | null
    reviewsCount: number
    positivePercentage: number
  }
  specialist?: {
    id: string
    userId: string
    name: string
    avatar: string
    reviewCount: number
    rating: number
  } | null
  timeline: {
    created: string
    approved?: string | null
  }
  isDirectOffer?: boolean
  accessLevel?: {
    isOwner: boolean
    isAssigned: boolean
    hasResponded: boolean
    canRespond: boolean
    showFullDetails: boolean
  }
}

interface SimilarOrder {
  id: string
  title: string
  clientName: string
  clientAvatar?: string
  location: string
  deadline: string
  status: string
  statusText: string
}

export default function OrderViewPage() {
  const params = useParams()
  const router = useRouter()
  const { getToken } = useAuth()
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id
  
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [similarOrders, setSimilarOrders] = useState<SimilarOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isOwnOrder, setIsOwnOrder] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (orderId) {
        await fetchOrderData()
        await fetchSimilarOrders()
      }
    }
    fetchData()
  }, [orderId]) // Убираем getToken из зависимостей

  const fetchOrderData = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = await getToken()
      
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Заказ не найден')
        }
        throw new Error('Не удалось загрузить данные заказа')
      }
      
      const data = await response.json()
      console.log('API response data:', data) // Для отладки
      console.log('Order rawStatus:', data.order?.rawStatus)
      console.log('Order specialist:', data.order?.specialist)
      console.log('Access level isOwner:', data.order?.accessLevel?.isOwner)
      
      // Сохраняем роль пользователя и проверяем, его ли это заказ
      if (data.user) {
        setUserRole(data.user.role)
        setIsOwnOrder(data.user.id === data.order.customerId)
      }
      
      // Используем реальные данные из API
      setOrderData({
        id: data.order.id,
        title: data.order.title,
        description: data.order.description,
        location: data.order.location ?? null,
        category: data.order.categories?.[1] || data.order.categories?.[0] || 'General',
        status: data.order.status,
        rawStatus: data.order.rawStatus,
        createdAt: data.order.createdAt,
        updatedAt: data.order.updatedAt,
        views: data.order.views,
        orderNumber: data.order.orderNumber,
        performDate: data.order.deadline,
        whatToExpect: data.order.whatToExpected,
        expectations: data.order.expectations ?? null,
        confidentialInfo: data.order.confidentialInfo,
        customer: {
          name: data.order.customer.name,
          avatar: data.order.customer.avatar ?? null,
          reviewsCount: data.order.customer.reviewsCount,
          positivePercentage: data.order.customer.positivePercentage
        },
        specialist: data.order.specialist || null,
        timeline: {
          created: data.order.customer.createdDate,
          approved: data.order.customer.approvedDate ?? null
        },
        isDirectOffer: data.order.isDirectOffer,
        accessLevel: data.order.accessLevel
      })
      
      console.log('OrderData set with rawStatus:', data.order.rawStatus, 'specialist:', data.order.specialist)
    } catch (error) {
      console.error('Error fetching order:', error)
      setError(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  const handleOfferService = async () => {
    try {
      const token = await getToken()
      
      const response = await fetch('/api/orders/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: orderId,
          action: 'offer'
        })
      })

      if (response.ok) {
        alert('Предложение отправлено!')
        router.push('/account?tab=suggestions')
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.message || error.error}`)
      }
    } catch (error) {
      console.error('Error offering service:', error)
      alert('Произошла ошибка при отправке предложения')
    }
  }

  const handleAcceptOrder = async () => {
    try {
      const token = await getToken()
      
      const response = await fetch('/api/orders/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: orderId,
          action: 'accept'
        })
      })

      if (response.ok) {
        alert('Заказ принят!')
        // Перенаправляем на страницу аккаунта с табом "At work"
        router.push('/account?tab=at-work')
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.message || error.error}`)
      }
    } catch (error) {
      console.error('Error accepting order:', error)
      alert('Произошла ошибка при принятии заказа')
    }
  }

  const handleDeclineOrder = async () => {
    if (!confirm('Вы уверены, что хотите отклонить этот заказ?')) {
      return
    }

    try {
      const token = await getToken()
      
      const response = await fetch('/api/orders/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: orderId,
          action: 'decline'
        })
      })

      if (response.ok) {
        alert('Заказ отклонен')
        router.push('/profile')
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.message || error.error}`)
      }
    } catch (error) {
      console.error('Error declining order:', error)
      alert('Произошла ошибка при отклонении заказа')
    }
  }

  const fetchSimilarOrders = async () => {
    try {
      const response = await fetch('/api/orders/all')
      
      if (response.ok) {
        const data = await response.json()
        console.log('API response for similar orders:', data)
        
        // API возвращает объект с полем orders
        let ordersArray = []
        if (data && Array.isArray(data.orders)) {
          ordersArray = data.orders
        } else if (Array.isArray(data)) {
          ordersArray = data
        } else {
          console.log('API response does not contain orders array:', data)
          setSimilarOrders([])
          return
        }
        
        // Преобразуем данные в формат SimilarOrder и исключаем текущий заказ
        const transformedOrders: SimilarOrder[] = ordersArray
          .filter((order: { id: string }) => order.id !== orderId)
          .map((order: { 
            id: string; 
            title: string; 
            user?: { name?: string; avatar?: string }; 
            location?: string; 
            status?: string,
            createdAt?: string
          }) => ({
            id: order.id,
            title: order.title,
            clientName: order.user?.name || 'Anonymous User',
            clientAvatar: order.user?.avatar,
            location: order.location || 'Location not specified',
            deadline: computeDeadline(order.createdAt),
            status: order.status?.toLowerCase() || 'open',
            statusText: getStatusText(order.status || 'OPEN')
          }))
        
        setSimilarOrders(transformedOrders)
      } else {
        console.error('Failed to fetch orders:', response.status, response.statusText)
        setSimilarOrders([])
      }
    } catch (error) {
      console.error('Error fetching similar orders:', error)
      // В случае ошибки просто оставляем пустой массив
      setSimilarOrders([])
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPerformDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  }

  const computeDeadline = (createdAt?: string) => {
    if (!createdAt) return ''
    const created = new Date(createdAt)
    const deadline = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000)
    return `To be completed by ${deadline.toLocaleDateString('en-US', { month: 'long', day: '2-digit' })}`
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Waiting for a specialist'
      case 'IN_PROGRESS':
        return 'In progress'
      case 'COMPLETED':
        return 'Completed'
      case 'CANCELLED':
        return 'Cancelled'
      default:
        return 'Waiting for a specialist'
    }
  }

  const handleSimilarOrderClick = (orderId: string) => {
    router.push(`/order/${orderId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#55c4c8]" />
          <span className="text-lg text-[#282a35]">Loading order...</span>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#282a35] mb-4">
            {error || 'Order not found'}
          </h2>
          <p className="text-[#646464] mb-6">
            Please check the link or try to return to the orders list.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/orders">
              <Button className="bg-[#55c4c8] hover:bg-[#4ab3b7] text-white rounded-full px-8">
                To orders list
              </Button>
            </Link>
            <Button 
              onClick={fetchOrderData}
              variant="outline"
              className="border-[#55c4c8] text-[#55c4c8] hover:bg-[#55c4c8] hover:text-white rounded-full px-8"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Main Content Container */}
        <div className="flex flex-col gap-6">
          {/* Top Section - Order Details + Customer Info */}
          <div className="flex gap-6">
            {/* Left Section - Order Details (895px) */}
            <div className="w-[895px] bg-white rounded-2xl">
              <div className="px-9 py-10">
                <div className="flex flex-col gap-9">
                  {/* Header Section */}
                  <div className="flex flex-col gap-6">
                    {/* Title and Order Info */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-[32px] font-bold text-[#282a35] leading-[110%]">
                          {orderData.title}
                        </h1>
                        <p className="text-base text-[#a3a3a3] leading-[150%]">
                          № {orderData.orderNumber}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Eye className="w-5 h-5 text-[#a3a3a3]" />
                          <span className="text-base text-[#a3a3a3] leading-[150%]">
                            Views: {orderData.views}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Categories */}
                    <div className="flex items-center gap-6">
                      <span className="text-base text-[#282a35] leading-[150%]">
                        Freelancing
                      </span>
                      <div className="w-[18px] h-px bg-[#282a35] opacity-20 rotate-90"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-base text-[#282a35] leading-[150%]">{orderData.category}</span>
                        <ChevronDown className="w-4 h-4 text-[#313030]" />
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="w-full h-px bg-[#282a35] opacity-20"></div>
                    
                    {/* Performance Date and Status */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="w-6 h-6 text-[#34979a]" />
                        <span className="text-base text-[#282a35] leading-[150%]">Perform:</span>
                        <span className="text-base font-medium text-[#282a35] leading-[150%]">
                          {formatPerformDate(orderData.performDate)}
                        </span>
                      </div>
                      <span 
                        className={`text-sm leading-[150%] ${
                          orderData.rawStatus === 'IN_PROGRESS' 
                            ? 'text-[#34a853]' 
                            : 'text-[#55c4c8]'
                        }`}
                      >
                        {getStatusText(orderData.status)}
                      </span>
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="flex flex-col gap-6">
                    {/* Order Description */}
                    <div className="flex flex-col gap-3">
                      <h2 className="text-xl font-medium text-black leading-[140%]">
                        Order description
                      </h2>
                      {orderData.description && (
                        <p className="text-base text-[#1e1c1c] leading-[150%]">
                          {orderData.description}
                        </p>
                      )}
                    </div>

                    {/* What to expect */}
                    {orderData.expectations && (
                      <div className="flex flex-col gap-3">
                        <h2 className="text-xl font-medium text-black leading-[140%]">
                          What to expect
                        </h2>
                        <p className="text-base text-[#1e1c1c] leading-[150%]">
                          {orderData.expectations}
                        </p>
                      </div>
                    )}

                    {/* Confidential information */}
                    {orderData.confidentialInfo && (
                      <div className="flex flex-col gap-3">
                        <h2 className="text-xl font-medium text-black leading-[140%]">
                          Confidential information
                        </h2>
                        <p className="text-base text-[#646464] leading-[150%]">
                          {orderData.confidentialInfo}
                        </p>
                      </div>
                    )}

                    {/* Order Completion Section - показываем только если кастомер и заказ IN_PROGRESS */}
                    {(() => {
                      const shouldShow = orderData.accessLevel?.isOwner && 
                                       orderData.rawStatus === 'IN_PROGRESS' && 
                                       orderData.specialist
                      console.log('OrderCompletionSection check:', {
                        isOwner: orderData.accessLevel?.isOwner,
                        rawStatus: orderData.rawStatus,
                        hasSpecialist: !!orderData.specialist,
                        shouldShow
                      })
                      return shouldShow && orderData.specialist ? (
                        <OrderCompletionSection 
                          orderId={orderData.id}
                          specialist={orderData.specialist}
                        />
                      ) : null
                    })()}
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-[#282a35] opacity-20"></div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-9">
                    {/* Если специалист может откликнуться */}
                    {orderData.accessLevel?.canRespond && (
                      <Button 
                        onClick={handleOfferService}
                        className="bg-[#55c4c8] hover:bg-[#4ab3b7] text-[#282a35] text-base font-medium leading-[150%] rounded-full px-9 py-3.5 h-auto"
                      >
                        offer service
                      </Button>
                    )}
                    
                    {/* Если это прямое предложение от кастомера - специалист может Accept/Decline */}
                    {orderData.isDirectOffer && orderData.accessLevel?.hasResponded && !orderData.accessLevel?.isAssigned && (
                      <div className="flex gap-4">
                        <Button 
                          onClick={handleAcceptOrder}
                          className="bg-[#55c4c8] hover:bg-[#4ab3b7] text-white text-base font-medium leading-[150%] rounded-full px-9 py-3.5 h-auto"
                        >
                          Accept Order
                        </Button>
                        <Button 
                          onClick={handleDeclineOrder}
                          variant="outline"
                          className="border-[#55c4c8] text-[#55c4c8] hover:bg-[#55c4c8] hover:text-white text-base font-medium leading-[150%] rounded-full px-9 py-3.5 h-auto"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                    
                    {/* Если специалист сам откликнулся - показываем что ждем решения кастомера */}
                    {!orderData.isDirectOffer && orderData.accessLevel?.hasResponded && !orderData.accessLevel?.isAssigned && (
                      <div className="text-base font-medium text-gray-600">
                        Waiting for customer's decision
                      </div>
                    )}
                    
                    {/* Если заказ уже назначен этому специалисту и еще в работе */}
                    {orderData.accessLevel?.isAssigned && orderData.rawStatus === 'IN_PROGRESS' && (
                      <div className="text-base font-medium text-[#55c4c8]">
                        You are working on this order
                      </div>
                    )}
                    
                    {/* Если заказ завершен или отменен */}
                    {orderData.accessLevel?.isAssigned && (orderData.rawStatus === 'COMPLETED' || orderData.rawStatus === 'CANCELLED') && (
                      <div className="text-base font-medium text-gray-500">
                        {orderData.rawStatus === 'COMPLETED' ? 'Order completed' : 'Order cancelled'}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 cursor-pointer">
                      <span className="text-base font-medium text-[#282a35] leading-[150%]">Complain</span>
                      <Info className="w-6 h-6 text-[#282a35] opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Customer Info (280px) */}
            <div className="w-[280px] bg-white rounded-2xl">
              <div className="px-5 py-6">
                <div className="flex flex-col gap-6">
                  {/* Customer Header */}
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={orderData.customer.avatar ?? undefined} />
                      <AvatarFallback className="bg-gray-200">
                        {orderData.customer.name?.charAt(0)?.toUpperCase() || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="text-xl font-medium text-[#282a35] leading-[140%] break-words overflow-wrap-anywhere">
                        {orderData.customer.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-[#a3a3a3] leading-[150%]">
                          Reviews: {orderData.customer.reviewsCount}
                        </span>
                        <div className="w-5 h-px bg-[#a3a3a3] rotate-90"></div>
                        <span className="text-xs text-[#a3a3a3] leading-[150%]">
                          Positive: {orderData.customer.positivePercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-full h-px bg-[#282a35] opacity-20"></div>
                  
                  {/* Status Information */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-[#34979a]" />
                      <span className="text-sm text-[#282a35] leading-[150%]">Created:</span>
                      <span className="text-sm font-medium text-[#282a35] leading-[130%]">
                        {formatDate(orderData.timeline.created)}
                      </span>
                    </div>
                    {orderData.timeline.approved && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#34979a]" />
                        <span className="text-sm text-[#282a35] leading-[150%]">Approved:</span>
                        <span className="text-sm font-medium text-[#282a35] leading-[130%]">
                          {orderData.timeline.approved}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Orders Section */}
          <div className="bg-white rounded-2xl">
            <div className="px-12 py-12">
              <div className="flex flex-col gap-9">
                {/* Header */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-[32px] font-bold text-[#282a35] leading-[110%]">
                    Similar orders
                  </h2>
                  <div className="w-full h-px bg-[#282a35] opacity-20"></div>
                </div>
                
                {/* Orders Grid */}
                <div className="flex flex-col gap-6">
                  {similarOrders.length > 0 ? (
                    similarOrders.map((order: SimilarOrder) => (
                      <div key={order.id} className="bg-white border border-[#e6e6e6] rounded-3xl p-6">
                        <div className="flex justify-between items-end">
                          <div className="flex gap-10">
                            <div className="flex items-start gap-6">
                              <Avatar className="w-20 h-20">
                                {order.clientAvatar && (
                                  <AvatarImage src={order.clientAvatar} />
                                )}
                                <AvatarFallback className="bg-gray-200">
                                  {order.clientName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col gap-6">
                                <h3 className="text-2xl font-bold text-[#282a35] leading-[150%]">
                                  {order.title}
                                </h3>
                                <div className="flex items-end gap-3">
                                  <span className="text-sm font-medium text-[#282a35] leading-[130%]">
                                    {order.clientName}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <div className="w-6 h-6">
                                      <svg viewBox="0 0 24 24" className="w-full h-full">
                                        <path fill="#a3a3a3" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                      </svg>
                                    </div>
                                    <span className="text-sm text-[#a3a3a3] leading-[150%]">
                                      {order.location}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-start gap-0">
                              <span className="text-sm text-[#a3a3a3] leading-[150%]">
                                {order.deadline}
                              </span>
                              <span className="text-sm text-[#55c4c8] leading-[150%]">
                                {order.statusText}
                              </span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleSimilarOrderClick(order.id)}
                            className="bg-[#55c4c8] hover:bg-[#4ab3b7] text-[#282a35] text-base font-medium leading-[120%] rounded-full px-9 py-4 h-auto"
                          >
                            review
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[#a3a3a3] text-lg">No similar orders available at the moment</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}