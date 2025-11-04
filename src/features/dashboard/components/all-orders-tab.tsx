// src/features/dashboard/components/all-orders-tab.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { CategoryCard } from '@/components/dashboard/category-card'
import { DashboardPagination } from '@/components/dashboard/pagination'
import { OrdersList } from '@/components/dashboard/orders-list'

interface Category {
  id: string
  name: string
  slug: string
  iconColor?: string
  ordersCount: number
}

interface OrdersData {
  orders: any[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface AllOrdersTabProps {
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function AllOrdersTab({ 
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {}
}: AllOrdersTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [ordersData, setOrdersData] = useState<OrdersData | null>(null)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [categoriesPage, setCategoriesPage] = useState(1)
  const [ordersPage, setOrdersPage] = useState(1)

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch orders when category is selected or page changes
  useEffect(() => {
    if (selectedCategory) {
      fetchOrdersByCategory(selectedCategory.id, ordersPage)
    }
  }, [selectedCategory, ordersPage])

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const response = await fetch('/api/categories/orders')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        console.error('Failed to fetch categories')
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchOrdersByCategory = async (categoryId: string, page: number = 1) => {
    try {
      setOrdersLoading(true)
      const response = await fetch(`/api/orders/by-category/${categoryId}?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setOrdersData(data)
      } else {
        console.error('Failed to fetch orders')
        setOrdersData(null)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrdersData(null)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setOrdersPage(1) // Reset to first page when selecting new category
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setOrdersData(null)
    setOrdersPage(1)
  }

  const handleOrdersPageChange = (page: number) => {
    setOrdersPage(page)
  }

  const handleCategoriesPageChange = (page: number) => {
    setCategoriesPage(page)
    onPageChange(page) // Also call the parent's page change handler
  }

  const handleOrderAction = (orderId: string) => {
    // Handle order action (view details, etc.)
    console.log('Order action for:', orderId)
    // Navigate to order details page
    window.location.href = `/order/${orderId}`
  }

  // If category is selected, show orders list
  if (selectedCategory && ordersData) {
    return (
      <OrdersList
        orders={ordersData.orders}
        categoryName={selectedCategory.name}
        currentPage={ordersData.pagination.currentPage}
        totalPages={ordersData.pagination.totalPages}
        isLoading={ordersLoading}
        onPageChange={handleOrdersPageChange}
        onBackToCategories={handleBackToCategories}
        onOrderAction={handleOrderAction}
      />
    )
  }

  // Show categories grid
  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-xl text-gray-600">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-xl text-gray-600 mb-2">No categories found</div>
            <div className="text-sm text-gray-500">
              There are no categories with orders available.
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1200px] mx-auto grid grid-cols-4 gap-5">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              ordersCount={category.ordersCount}
              isSelected={false} // No category is selected in grid view
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </div>
      )}

      {/* Pagination for categories */}
      {categories.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handleCategoriesPageChange}
          />
        </div>
      )}
    </div>
  )
}