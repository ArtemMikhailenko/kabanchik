'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageIcon, Trash2, X, ChevronDown, Upload } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

interface PortfolioItem {
  id: string
  image: string
  tags: string[]
  title?: string
  description?: string
}

interface PortfolioTabProps {}

export const PortfolioTab = () => {
  const { profile, updateProfile } = useProfile()
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [portfolioImages, setPortfolioImages] = useState<File[]>([])
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Available tags for selection
  const availableTags = [
    'Web Design',
    'Mobile Development',
    'E-commerce',
    'WordPress',
    'Shopify',
    'Custom Development',
    'UI/UX Design',
    'Frontend Development',
    'Backend Development',
    'Full Stack Development'
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('Click outside detected')
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Closing dropdown from outside click')
        setShowTagDropdown(false)
      }
    }

    if (showTagDropdown) {
      // Добавляем обработчик с задержкой, чтобы не конфликтовать с кликом по тегу
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTagDropdown])

  const handleTagSelect = (tag: string) => {
    console.log('handleTagSelect called with:', tag)
    console.log('Current selectedTags:', selectedTags)
    
    if (selectedTags.includes(tag)) {
      // Убираем тег если он уже выбран
      const newTags = selectedTags.filter(t => t !== tag)
      setSelectedTags(newTags)
      console.log('Removed tag, updated selectedTags to:', newTags)
      
      // Если это был последний выбранный тег, очищаем selectedTag
      if (selectedTag === tag) {
        setSelectedTag(newTags.length > 0 ? newTags[newTags.length - 1] : '')
      }
    } else {
      // Добавляем новый тег
      const newTags = [...selectedTags, tag]
      setSelectedTags(newTags)
      setSelectedTag(tag) // устанавливаем как текущий выбранный
      console.log('Added tag, updated selectedTags to:', newTags)
    }
    
    // Не закрываем dropdown, чтобы можно было выбрать несколько тегов
    // setShowTagDropdown(false)
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove))
    if (selectedTag === tagToRemove) {
      setSelectedTag('')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    console.log('File selected:', file.name)
    
    // Add file to portfolioImages array instead of uploading immediately
    setPortfolioImages(prev => [...prev, file])
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/profile/portfolio/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete portfolio item')
      }

      // Remove from local state
      setPortfolioItems(prev => prev.filter(item => item.id !== id))
      
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      alert('Failed to delete portfolio item. Please try again.')
    }
  }

  const handleDragClick = () => {
    fileInputRef.current?.click()
  }

  const handleSavePortfolio = async () => {
    if (selectedTags.length === 0 || portfolioImages.length === 0) {
      alert('Please select at least one tag and upload at least one image')
      return
    }

    setIsLoading(true)
    
    try {
      // Upload each image as a portfolio item
      const uploadPromises = portfolioImages.map(async (image) => {
        console.log('Uploading image:', image.name, 'with tags:', selectedTags)
        
        const formData = new FormData()
        formData.append('file', image) // Изменено с 'portfolio' на 'file'
        formData.append('tags', JSON.stringify(selectedTags))
        formData.append('title', image.name.split('.')[0])
        formData.append('description', '')

        console.log('FormData contents:')
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value)
        }

        const response = await fetch('/api/profile/portfolio', {
          method: 'POST',
          body: formData
        })

        console.log('Response status:', response.status)
        const responseText = await response.text()
        console.log('Response text:', responseText)

        if (!response.ok) {
          throw new Error(`Failed to upload portfolio item: ${responseText}`)
        }

        return JSON.parse(responseText)
      })

      const results = await Promise.all(uploadPromises)
      
      console.log('Upload results:', results)
      
      // Add new items to local state
      const newItems: PortfolioItem[] = results.map(result => {
        console.log('Processing result:', result)
        const item = {
          id: result.portfolioItem.id,
          image: result.portfolioItem.image, // Используем поле image вместо imageUrl
          tags: result.portfolioItem.tags || selectedTags,
          title: result.portfolioItem.title || '',
          description: result.portfolioItem.description || ''
        }
        console.log('Created item:', item)
        return item
      })

      console.log('New items to add:', newItems)
      setPortfolioItems(prev => {
        const updated = [...prev, ...newItems]
        console.log('Updated portfolio items:', updated)
        return updated
      })
      
      // Clear form
      setPortfolioImages([])
      setSelectedTag('')
      setSelectedTags([])
      
      alert('Portfolio saved successfully!')
      
    } catch (error) {
      console.error('Error saving portfolio:', error)
      alert('Failed to save portfolio. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('Click outside detected')
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Closing dropdown from outside click')
        setShowTagDropdown(false)
      }
    }

    if (showTagDropdown) {
      // Добавляем обработчик с задержкой, чтобы не конфликтовать с кликом по тегу
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTagDropdown])

  // Load existing portfolio items
  useEffect(() => {
    const loadPortfolioItems = async () => {
      try {
        console.log('Loading portfolio items...')
        const response = await fetch('/api/profile/portfolio')
        if (response.ok) {
          const data = await response.json()
          console.log('Portfolio data received:', data)
          if (data.portfolioItems) {
            const mappedItems = data.portfolioItems.map((item: any) => ({
              id: item.id,
              image: item.image,
              tags: item.tags || [],
              title: item.title || '',
              description: item.description || ''
            }))
            console.log('Mapped portfolio items:', mappedItems)
            setPortfolioItems(mappedItems)
          }
        } else {
          console.error('Failed to fetch portfolio items:', response.statusText)
        }
      } catch (error) {
        console.error('Error loading portfolio items:', error)
      }
    }

    loadPortfolioItems()
  }, [])

  return (
    <div className="w-[1044px] flex flex-col gap-[24px] mx-auto pt-10 rounded-l">
      {/* Upload Area */}
      <div 
        className="w-[1044px] h-[178px] border border-dashed border-[#d8d6d6] rounded-[24px] flex flex-col items-center justify-center px-[352px] py-[36px] gap-[18px] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleDragClick}
      >
        <div className="w-[64px] h-[64px] flex items-center justify-center">
          {isUploading ? (
            <Upload className="w-[53px] h-[53px] text-[#55c4c8] animate-spin" />
          ) : (
            <ImageIcon className="w-[53px] h-[53px] text-[#d8d6d6]" />
          )}
        </div>
        <p className="text-[16px] text-[#282a35] leading-[150%] w-[307px] h-[24px] text-center">
          {isUploading ? 'Uploading...' : 'drag the file here or click to add it'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Filters and Save Button */}
      <div className="w-[1044px] h-[66px] flex gap-[72px]">
        {/* Left section with dropdown and tags */}
        <div className="w-[751px] h-[66px] flex gap-[36px]">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="w-[378px] h-[54px] bg-white border border-[#d8d6d6] rounded-[40px] flex justify-between items-center px-[20px] py-[15px] cursor-pointer hover:border-[#55c4c8] transition-colors"
              onClick={() => setShowTagDropdown(!showTagDropdown)}
            >
              <span className="text-[16px] text-[#282a35] leading-[150%]">
                {selectedTags.length > 0 
                  ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`
                  : 'Select tags'
                }
              </span>
              <ChevronDown className="w-[20px] h-[20px] text-[#282a35]" />
            </div>
            
            {/* Dropdown menu */}
            {showTagDropdown && (
              <div 
                className="absolute top-full left-0 mt-2 w-[378px] bg-white border border-[#d8d6d6] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {availableTags.map((tag, index) => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <div
                      key={index}
                      className={`px-4 py-3 cursor-pointer text-[16px] border-b last:border-b-0 flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#55c4c8] text-white' 
                          : 'text-[#282a35] hover:bg-gray-50'
                      }`}
                      onMouseDown={(e) => {
                        console.log('Tag mousedown:', tag)
                        e.preventDefault()
                        e.stopPropagation()
                        handleTagSelect(tag)
                      }}
                    >
                      <span>{tag}</span>
                      {isSelected && <span>✓</span>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Selected Tags */}
          <div className="w-[437px] h-[66px] flex gap-[8px] flex-wrap">
            {selectedTags.map((tag, index) => (
              <div key={index} className="h-[29px] border border-[#646464] rounded-[40px] flex items-center gap-[10px] px-[12px] py-[8px]">
                <span className="text-[12px] text-[#646464] leading-[150%]">
                  {tag}
                </span>
                <X 
                  className="w-[12px] h-[12px] text-[#646464] cursor-pointer hover:text-red-500" 
                  onClick={() => handleRemoveTag(tag)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSavePortfolio}
          disabled={isLoading || isUploading}
          className="w-[221px] h-[51px] bg-[#55c4c8] hover:bg-[#4ab5b9] text-[#282a35] text-[16px] font-medium rounded-[50px] px-[36px] py-[16px] leading-[120%] disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Selected Files Preview */}
      {portfolioImages.length > 0 && (
        <div className="w-[1044px] mb-6">
          <h3 className="text-lg font-medium mb-4">Selected Files ({portfolioImages.length})</h3>
          <div className="flex gap-4 flex-wrap">
            {portfolioImages.map((file, index) => (
              <div key={index} className="relative w-[150px] h-[150px] border border-gray-300 rounded-lg overflow-hidden">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Selected ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPortfolioImages(prev => prev.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="w-[1044px] flex flex-wrap gap-[24px]">
        {portfolioItems.map((item) => (
          <div key={item.id} className="w-[243px] h-[311px] flex flex-col gap-[8px]">
            {/* Image Container */}
            <div className="relative w-[243px] h-[243px] rounded-[16px] overflow-hidden group">
              <img 
                src={item.image} 
                alt="Portfolio item"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="w-[36px] h-[36px] flex items-center justify-center"
                >
                  <Trash2 className="w-[27px] h-[30px] text-white" />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="w-[243px] h-[60px] flex gap-[4px] flex-wrap">
              {item.tags.map((tag, tagIndex) => (
                <div key={tagIndex} className="h-[26px] border border-[#646464] rounded-[40px] flex items-center px-[12px] py-[4px]">
                  <span className="text-[12px] text-[#646464] leading-[150%]">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}