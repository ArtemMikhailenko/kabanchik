'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DashboardPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    
    // Всегда показываем первую страницу
    pages.push(1)
    
    if (currentPage > 3) {
      pages.push('...')
    }
    
    // Показываем страницы вокруг текущей
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...')
    }
    
    // Всегда показываем последнюю страницу (если она не первая)
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <div className="flex justify-center items-center gap-1 mt-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 p-0 hover:bg-gray-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      {generatePageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 py-1 text-gray-400">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`w-8 h-8 p-0 ${
                currentPage === page 
                  ? 'bg-gray-900 text-white hover:bg-gray-800' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 p-0 hover:bg-gray-100"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}