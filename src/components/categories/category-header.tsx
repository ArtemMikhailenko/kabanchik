'use client'

import React from 'react'

interface CategoryHeaderProps {
  title?: string
}

export function CategoryHeader({ title = "categories of services" }: CategoryHeaderProps) {
  return (
    <div className="w-full max-w-[1202px] bg-[#ffd2aa] rounded-[24px] h-[200px] flex items-center justify-between px-[55px] relative overflow-hidden">
      <h1 className="text-[56px] flex-1 font-bold text-[#282a35] leading-[66px] uppercase tracking-wide max-w-[747px]">
        {title}
      </h1>
      
      <div className="relative flex-1  top-1/2 transform -translate-y-1/2 flex items-center gap-4 max-w-[320px]">
        <img src="/category-banner.png" alt="" />
      </div>
    </div>
  )
}
