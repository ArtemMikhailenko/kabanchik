'use client'

import React from 'react'
import { X } from 'lucide-react'

interface FilterTab {
  id: string
  label: string
}

interface FilterTabsProps {
  filters: FilterTab[]
  onRemoveFilter: (filterId: string) => void
}

export function FilterTabs({ filters, onRemoveFilter }: FilterTabsProps) {
  return (
    <div className="w-full max-w-[500px] flex items-center gap-6">
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center gap-[10px] border border-[#646464] rounded-[40px] px-3 py-2 h-[29px]"
        >
          <span className="text-xs text-[#646464] leading-[150%] text-nowrap">
            {filter.label}
          </span>
          <button
            onClick={() => onRemoveFilter(filter.id)}
            className="w-3 h-3 flex items-center justify-center text-[#646464] hover:text-gray-800 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
