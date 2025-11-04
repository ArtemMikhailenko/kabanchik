'use client'

import React from 'react'
import { CategoryItem } from './category-item'

interface Category {
  id: number | string
  title: string
  services: string[]
  iconColor: string
  icon?: React.ReactNode
  slug?: string
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[44px]">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            title={category.title}
            services={category.services}
            iconColor={category.iconColor}
            icon={category.icon}
            slug={category.slug}
          />
        ))}
      </div>
    </div>
  )
}
