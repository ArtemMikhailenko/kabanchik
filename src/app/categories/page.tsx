'use client'

import React, { useState, useEffect } from 'react'
import { CategoryHeader, CategoryGrid } from '@/components/categories'
import type { Category } from '@/components/categories/constants'
import { useTranslations } from 'next-intl'

export default function CategoriesPage() {
  const t = useTranslations('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/hierarchical')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-[80px] flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      <div className="container mx-auto px-4 py-8 max-w-[1440px]">
        <div className="flex justify-center mb-16">
          <CategoryHeader title={t('title')} />
        </div>
        
        <div className="flex justify-center">
          <CategoryGrid categories={categories} />
        </div>
      </div>
    </div>
  )
}
