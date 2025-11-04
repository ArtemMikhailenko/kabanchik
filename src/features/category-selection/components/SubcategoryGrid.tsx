import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface SubcategoryGridProps {
  subcategories: string[]
  selectedSubcategories: string[]
  selectAll: boolean
  onToggleSubcategory: (subcategory: string) => void
  onToggleSelectAll: () => void
}

export function SubcategoryGrid({
  subcategories,
  selectedSubcategories,
  selectAll,
  onToggleSubcategory,
  onToggleSelectAll
}: SubcategoryGridProps) {
  return (
    <>
      {/* Select All option */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={onToggleSelectAll}
            className="data-[state=checked]:bg-[#55c4c8] data-[state=checked]:border-[#55c4c8]"
          />
          <Label 
            htmlFor="select-all" 
            className="text-lg font-medium text-gray-900 cursor-pointer"
          >
            All offers in the category
          </Label>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {subcategories.map((subcategory, index) => {
          const isSelected = selectedSubcategories.includes(subcategory)
          const checkboxId = `subcategory-${index}`
          
          return (
            <Card 
              key={index}
              className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-[#55c4c8] bg-[#55c4c8]/5' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onToggleSubcategory(subcategory)}
            >
              <CardContent className="">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={checkboxId}
                    checked={isSelected}
                    onCheckedChange={() => onToggleSubcategory(subcategory)}
                    className="data-[state=checked]:bg-[#55c4c8] data-[state=checked]:border-[#55c4c8]"
                  />
                  <Label 
                    htmlFor={checkboxId}
                    className="text-sm font-medium text-gray-900 cursor-pointer flex-1"
                  >
                    {subcategory}
                  </Label>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}