// src/components/dashboard/orders-filters.tsx
'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'

interface Filter {
  id: string
  label: string
}

interface OrdersFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  activeFilters: Filter[]
  onFilterRemove: (filterId: string) => void
}

export function OrdersFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  activeFilters,
  onFilterRemove
}: OrdersFiltersProps) {
  const categories = [
    'Categories',
    'Construction',
    'Repair', 
    'Cleaning',
    'Design',
    'Electronics',
    'Garden',
    'Transport'
  ]

  return (
    <div className="bg-white space-y-4 mb-6">
      {/* Filters Row */}
      <div className="flex items-center justify-between">
        {/* Categories Dropdown */}
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        <div className="flex items-center gap-2">
          {activeFilters.map((filter) => (
            <Badge 
              key={filter.id}
              variant="secondary" 
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1 px-3 py-1"
            >
              {filter.label}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-gray-900" 
                onClick={() => onFilterRemove(filter.id)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Search Row */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
    </div>
  )
}