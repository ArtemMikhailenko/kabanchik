'use client'

import React from 'react'



interface Filter {
  id: string
  label: string
}

interface SearchResultsHeaderProps {
  category: string
  description: string
  activeFilters: Filter[]
  onFilterRemove: (filterId: string) => void
}

export function SearchResultsHeader({ 
  category, 
  description, 
  activeFilters, 
  onFilterRemove 
}: SearchResultsHeaderProps) {
  return (
    <div className="bg-[#ffd2aa] relative overflow-hidden pt-30 pb-10 ">
      <div className="mx-auto relative z-10 flex items-center justify-between">
        <div className="max-w-2xl ml-[115px]">
          <h1 className="text-[56px] font-bold text-[#282a35] mb-3 leading-[66px] font-['Helvetica_Neue'] uppercase">
            SPECIALISTS OF THE
            <br />
            SELECTED CATEGORY
          </h1>
          <p className="text-[20px] text-[#282a35] leading-[28px] mb-8 max-w-[618px] font-medium font-['Helvetica_Neue']">
            {description}
          </p>
          
         
        </div>
        
        {/* Decorative Tools Illustration */}
        <div className="absolute right-10 -bottom-10 flex-shrink-0">
          <img src="/search-banner.png" alt="" className="w-auto h-auto max-h-[214px]" />
        </div>
      </div>
    </div>
  )
}