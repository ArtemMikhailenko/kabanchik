
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { 
  useCategorySelection,
  CategoryGrid,
  SubcategoryGrid,
  CategorySelectionHeader
} from '@/features/category-selection'

export default function CategorySelectionPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  
  const {
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
  } = useCategorySelection()

  // Проверяем аутентификацию и создаем пользователя в БД
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/role-selection')
    } else if (isLoaded && user) {
      // Создаем пользователя в нашей БД если его еще нет
      fetch('/api/users', { method: 'POST' }).catch(console.error)
    }
  }, [isLoaded, user, router])

  const handleCategorySelect = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (category) {
      selectCategory(category)
    }
  }

  const handleContinue = async () => {
    if (state.viewMode === 'categories' && state.selectedCategory) {
      // Если мы на странице категорий и выбрана категория - переходим к подкатегориям
      selectCategory(state.selectedCategory)
    } else if (state.viewMode === 'subcategories' && allSelectedSubcategories.length > 0) {
      // Если мы на странице подкатегорий и выбраны подкатегории - завершаем процесс
      try {
                // Подготавливаем данные для отправки
        const selectedCategories = Object.keys(state.selectedSubcategoriesByCategory || {}).filter(
          categoryName => (state.selectedSubcategoriesByCategory || {})[categoryName]?.length > 0
        )
        
        // Отправляем данные на сервер для сохранения в профиль специалиста
        const response = await fetch('/api/specialist/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categories: selectedCategories,
            subcategories: allSelectedSubcategories
          })
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Categories saved successfully:', result)
          
          // Сохраняем в localStorage для совместимости
          const selectedCategories = state.selectedSubcategoriesByCategory 
            ? Object.keys(state.selectedSubcategoriesByCategory).filter(
                categoryName => (state.selectedSubcategoriesByCategory || {})[categoryName]?.length > 0
              )
            : []
          localStorage.setItem('selectedCategory', selectedCategories.join(', '))
          localStorage.setItem('selectedSubcategories', JSON.stringify(allSelectedSubcategories))
          
          // Очищаем состояние выбора категорий после успешного сохранения
          clearSelection()
          
          // Переходим на дашборд
          router.push('/dashboard')
        } else {
          const error = await response.json()
          console.error('Error saving categories:', error)
          alert('Ошибка при сохранении категорий. Попробуйте еще раз.')
        }
      } catch (error) {
        console.error('Error saving selection:', error)
        alert('Ошибка сети. Проверьте подключение к интернету.')
      }
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
      <div className="max-w-[1200px] mx-auto">
     
        <CategorySelectionHeader
          viewMode={state.viewMode}
          selectedCategoryName={state.selectedCategory?.name}
          searchTerm={state.searchTerm}
          totalSelectedSubcategories={allSelectedSubcategories.length}
          onBack={backToCategories}
          onSearchChange={setSearchTerm}
        />

        {/* Categories Grid */}
        {state.viewMode === 'categories' && (
          <CategoryGrid
            categories={filteredCategories}
            selectedCategoryId={state.selectedCategory?.id || null}
            selectedSubcategoriesByCategory={state.selectedSubcategoriesByCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {/* Subcategories */}
        {state.viewMode === 'subcategories' && (
          <SubcategoryGrid
            subcategories={subcategories}
            selectedSubcategories={currentCategorySubcategories}
            selectAll={state.selectAll}
            onToggleSubcategory={toggleSubcategory}
            onToggleSelectAll={toggleSelectAll}
          />
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={
              (state.viewMode === 'categories' && !state.selectedCategory) ||
              (state.viewMode === 'subcategories' && allSelectedSubcategories.length === 0)
            }
            className="bg-[#55c4c8] hover:bg-[#4ab5ba] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-16 py-4 rounded-full text-lg font-medium transition-all duration-300 min-w-[200px]"
          >
            continue
          </Button>
        </div>
      </div>
    </div>
  )
}