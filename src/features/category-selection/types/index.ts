export interface Category {
    id: number
    name: string
    orders: number
    slug?: string
    services?: string[]
    iconColor?: string
  }
  
  export interface CategorySelectionState {
    selectedCategory: Category | null
    selectedSubcategoriesByCategory: Record<string, string[]> // Подкатегории по категориям
    viewMode: 'categories' | 'subcategories'
    searchTerm: string
    selectAll: boolean
  }