// src/features/category-selection/components/CategoryGrid.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Settings } from 'lucide-react'
import { Category } from '../types'

interface CategoryGridProps {
  categories: Category[]
  selectedCategoryId: number | null
  selectedSubcategoriesByCategory: Record<string, string[]>
  onCategorySelect: (categoryId: number) => void
}

export function CategoryGrid({ 
  categories, 
  selectedCategoryId,
  selectedSubcategoriesByCategory,
  onCategorySelect 
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id
        const hasSelectedSubcategories = selectedSubcategoriesByCategory?.[category.name]?.length > 0
        const selectedCount = selectedSubcategoriesByCategory?.[category.name]?.length || 0
        
        return (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${
              isSelected
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'bg-white hover:bg-[#55c4c8] hover:text-white'
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-[20px]">
              <div className="flex items-center gap-4">
                <Avatar className={`w-12 h-12 transition-colors ${
                  isSelected
                    ? 'bg-blue-100'
                    : 'bg-gray-100 group-hover:bg-white/20'
                }`}>
                  <AvatarFallback className={`transition-colors ${
                    isSelected
                      ? 'bg-blue-100'
                      : 'bg-gray-100 group-hover:bg-white/20'
                  }`}>
                    <Settings className={`w-6 h-6 transition-colors ${
                      isSelected
                        ? 'text-blue-600'
                        : 'text-gray-600 group-hover:text-white'
                    }`} />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-base mb-2 truncate transition-colors ${
                    isSelected
                      ? 'text-blue-900'
                      : 'text-gray-900 group-hover:text-white'
                  }`}>
                    {category.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary"
                      className={`text-xs transition-colors ${
                        isSelected
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-white/20 group-hover:text-white'
                      }`}
                    >
                      {category.orders} orders
                    </Badge>
                    
                    {hasSelectedSubcategories && (
                      <Badge 
                        variant="default"
                        className="text-xs bg-[#55c4c8] text-white hover:bg-[#4ab5ba]"
                      >
                        {selectedCount} selected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}