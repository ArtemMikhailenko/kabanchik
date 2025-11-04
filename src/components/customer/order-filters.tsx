import { Select } from '@/components/ui/select'

// Icons
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="#282A35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3L3 9M3 3L9 9" stroke="#646464" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface FilterChipProps {
  label: string
  onRemove?: () => void
}

const FilterChip = ({ label, onRemove }: FilterChipProps) => (
  <div className="flex items-center gap-2 bg-white border border-[#646464] rounded-full px-3 py-2">
    <span className="text-xs text-[#646464]">{label}</span>
    <button onClick={onRemove} className="flex items-center justify-center">
      <CloseIcon />
    </button>
  </div>
)

interface OrderFiltersProps {
  selectedCategory?: string
  activeFilters?: string[]
  onCategoryChange?: (category: string) => void
  onFilterRemove?: (filter: string) => void
}

export const OrderFilters = ({ 
  selectedCategory = "Categories", 
  activeFilters = ["filter option", "filter option", "filter option", "filter option"],
  onCategoryChange,
  onFilterRemove 
}: OrderFiltersProps) => (
  <div className="w-full bg-[#f7f7f7] rounded-2xl px-9 py-5 mb-6">
    <div className="flex items-center justify-between">
      {/* Categories Dropdown */}
      <div className="w-[279px]">
        <Select>
          <div className="w-full bg-white border border-[#e6e6e6] rounded-full px-5 py-3 flex items-center justify-between cursor-pointer">
            <span className="text-base text-[#282a35] opacity-80">{selectedCategory}</span>
            <ChevronDownIcon />
          </div>
        </Select>
      </div>
      
      {/* Filter Chips */}
      <div className="flex items-center gap-4">
        {activeFilters.map((filter, index) => (
          <FilterChip 
            key={index} 
            label={filter} 
            onRemove={() => onFilterRemove?.(filter)}
          />
        ))}
      </div>
    </div>
  </div>
)
