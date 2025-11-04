import { useState, useEffect } from 'react'
import { Category, CategorySelectionState } from '../types'

interface ApiCategory {
  id: string
  title: string
  slug: string
  services: string[]
  iconColor: string
  description?: string
  orderCount: number
}

export const useCategorySelection = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<CategorySelectionState>(() => {
    // Восстанавливаем состояние из localStorage при инициализации
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('categorySelectionState')
      if (savedState) {
        try {
          return JSON.parse(savedState)
        } catch {
          // Если ошибка парсинга, используем значение по умолчанию
        }
      }
    }
    return {
      selectedCategory: null,
      selectedSubcategoriesByCategory: {},
      viewMode: 'categories',
      searchTerm: '',
      selectAll: false
    }
  })

  // Сохраняем состояние в localStorage при каждом изменении
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('categorySelectionState', JSON.stringify(state))
    }
  }, [state])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/hierarchical')
        const data = await response.json()
        
        // Transform API data to match expected format
        const transformedCategories: Category[] = data.categories.map((cat: ApiCategory, index: number) => ({
          id: index + 1, // Use index as ID for compatibility
          name: cat.title,
          orders: cat.orderCount, // Use real order count from API
          slug: cat.slug,
          services: cat.services,
          iconColor: cat.iconColor
        }))
        
        setCategories(transformedCategories)

        // Восстанавливаем выбранную категорию после загрузки категорий
        setState(prevState => {
          if (prevState.selectedCategory && prevState.selectedCategory.name) {
            const restoredCategory = transformedCategories.find(cat => cat.name === prevState.selectedCategory!.name)
            if (restoredCategory) {
              return {
                ...prevState,
                selectedCategory: restoredCategory
              }
            }
          }
          return prevState
        })
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, []) // Убираем state из зависимостей чтобы избежать бесконечного цикла

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(state.searchTerm.toLowerCase())
  )

  const subcategories = state.selectedCategory ? 
    (state.selectedCategory.services || []) : []

  // Получаем выбранные подкатегории для текущей категории
  const currentCategorySubcategories = state.selectedCategory 
    ? (state.selectedSubcategoriesByCategory?.[state.selectedCategory.name] || [])
    : []

  // Получаем все выбранные подкатегории из всех категорий
  const allSelectedSubcategories = state.selectedSubcategoriesByCategory 
    ? Object.values(state.selectedSubcategoriesByCategory).flat()
    : []

  const selectCategory = (category: Category) => {
    setState(prev => ({
      ...prev,
      selectedCategory: category,
      viewMode: 'subcategories',
      searchTerm: '',
      // Вычисляем selectAll на основе текущих выборов для этой категории
      selectAll: category.services ? 
        ((prev.selectedSubcategoriesByCategory?.[category.name] || []).length === category.services.length) :
        false
    }))
  }

  const backToCategories = () => {
    setState(prev => ({
      ...prev,
      viewMode: 'categories',
      // Сохраняем выбранную категорию и подкатегории при возврате
      searchTerm: ''
    }))
  }

  const clearSelection = () => {
    setState({
      selectedCategory: null,
      selectedSubcategoriesByCategory: {},
      viewMode: 'categories',
      searchTerm: '',
      selectAll: false
    })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('categorySelectionState')
    }
  }

  const toggleSubcategory = (subcategory: string) => {
    if (!state.selectedCategory) return

    setState(prev => {
      const categoryName = prev.selectedCategory!.name
      const currentCategorySubcategories = prev.selectedSubcategoriesByCategory?.[categoryName] || []
      
      const newSelected = currentCategorySubcategories.includes(subcategory)
        ? currentCategorySubcategories.filter((item: string) => item !== subcategory)
        : [...currentCategorySubcategories, subcategory]
      
      const newSubcategoriesByCategory = {
        ...(prev.selectedSubcategoriesByCategory || {}),
        [categoryName]: newSelected
      }

      return {
        ...prev,
        selectedSubcategoriesByCategory: newSubcategoriesByCategory,
        selectAll: newSelected.length === subcategories.length
      }
    })
  }

  const toggleSelectAll = () => {
    if (!state.selectedCategory) return

    setState(prev => {
      const categoryName = prev.selectedCategory!.name
      const newSubcategoriesByCategory = {
        ...(prev.selectedSubcategoriesByCategory || {}),
        [categoryName]: prev.selectAll ? [] : [...subcategories]
      }

      return {
        ...prev,
        selectedSubcategoriesByCategory: newSubcategoriesByCategory,
        selectAll: !prev.selectAll
      }
    })
  }

  const setSearchTerm = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }))
  }

  return {
    state,
    categories,
    loading,
    filteredCategories,
    subcategories,
    currentCategorySubcategories,
    allSelectedSubcategories,
    selectCategory,
    backToCategories,
    clearSelection,
    toggleSubcategory,
    toggleSelectAll,
    setSearchTerm
  }
}
