// src/features/category-selection/components/CategorySelectionHeader.tsx
import { ArrowLeft, Search, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface CategorySelectionHeaderProps {
  viewMode: 'categories' | 'subcategories'
  selectedCategoryName?: string
  searchTerm: string
  totalSelectedSubcategories?: number
  onBack?: () => void
  onSearchChange: (term: string) => void
}

export function CategorySelectionHeader({
  viewMode,
  selectedCategoryName,
  searchTerm,
  totalSelectedSubcategories = 0,
  onBack,
  onSearchChange
}: CategorySelectionHeaderProps) {
  return (
    <div className="mb-8">
      {viewMode === 'subcategories' ? (
        // Header для подкатегорий
        <div className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedCategoryName}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Didn't find the right subcategory?</span>
              <Button 
                variant="link" 
                size="sm"
                className="text-[#55c4c8] hover:text-[#4ab5ba] p-0 h-auto font-medium"
                asChild
              >
                <a href="mailto:support@example.com" className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Write to us
                </a>
              </Button>
            </div>
          </div>
          <Separator />
        </div>
      ) : (
        // Header для категорий
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Select a category
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Select the main category in which you plan to work. You can add or edit categories later.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 py-3 text-base focus-visible:ring-[#55c4c8] focus-visible:border-[#55c4c8]"
              />
            </div>
            
            {totalSelectedSubcategories > 0 && (
              <div className="text-sm text-gray-600">
                Selected: <span className="font-medium text-[#55c4c8]">{totalSelectedSubcategories}</span> subcategories
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}