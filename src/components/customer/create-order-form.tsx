'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Icons
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="#34979A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface Category {
  id: string
  title: string
  slug: string
}

interface CreateOrderFormProps {
  isExpanded: boolean
  onToggleExpand?: () => void
  onOrderCreated?: () => void
  // If provided, the new order will be addressed to this specialist
  specialistId?: string
  // Optional custom label for the submit button (e.g., "Send job offer")
  submitButtonLabel?: string
}

export const CreateOrderForm = ({ isExpanded, onToggleExpand, onOrderCreated, specialistId, submitButtonLabel }: CreateOrderFormProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState('')
  const [task, setTask] = useState('')
  const [description, setDescription] = useState('')
  const [confidentialData, setConfidentialData] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!category || !task || !description) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('category', category)
      formData.append('task', task)
      formData.append('description', description)
      formData.append('confidentialData', confidentialData)
      if (specialistId) {
        formData.append('specialistId', specialistId)
      }
      
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file)
      })

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      console.log('Order created:', data.order)

      // Reset form
      setCategory('')
      setTask('')
      setDescription('')
      setConfidentialData('')
      setFiles([])
      
      // Collapse form after successful submission
      onToggleExpand?.()
      
      // Trigger refetch of orders
      onOrderCreated?.()
      
      alert('Order created successfully!')
    } catch (error) {
      console.error('Error creating order:', error)
      alert(`Error creating order: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isExpanded) {
    return (
      <div className="w-full bg-[#f7f7f7] rounded-2xl px-9 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#282a35] opacity-80 mb-2">Create a new order</h3>
            <p className="text-base font-medium text-[#282a35] opacity-80">
              Create an order faster and we will find the best specialist within 10 minutes.
            </p>
          </div>
          <Button 
            onClick={onToggleExpand}
            className="bg-[#ffa657] text-[#282a35] px-9 py-6 rounded-full text-base font-medium hover:bg-[#ff9944]"
          >
            Create an order
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f7f7f7] rounded-2xl p-9 mb-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#282a35] opacity-80">Create a new order</h3>
      </div>
      
      <div className="flex gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-4">
          <div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full bg-white border border-[#d8d6d6] rounded-full px-5 py-4 h-auto">
                <SelectValue placeholder="Select a category" className="text-base text-[#282a35] opacity-80" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.title}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-base text-[#282a35] opacity-80 mb-1">What you need to do</label>
            <Input 
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full bg-white border border-[#d8d6d6] rounded-full px-5 py-4 text-base"
              placeholder=""
            />
          </div>
          
          <div>
            <label className="block text-base text-[#282a35] opacity-80 mb-1">Description</label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-[#d8d6d6] rounded-2xl px-5 py-4 min-h-[109px] resize-none text-base"
              placeholder=""
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-base text-[#282a35] opacity-80 mb-1">Confidential data</label>
            <p className="text-xs text-[#646464] mb-1">Only the selected specialist will see this data</p>
            <Textarea 
              value={confidentialData}
              onChange={(e) => setConfidentialData(e.target.value)}
              className="w-full bg-white border border-[#d8d6d6] rounded-2xl px-5 py-4 min-h-[109px] resize-none text-base"
              placeholder=""
            />
          </div>
          
          {/* File Upload */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <div 
              onClick={handleFileSelect}
              className="flex items-center gap-2 text-[#34979a] cursor-pointer hover:text-[#2a7a7d]"
            >
              <PlusIcon />
              <span className="text-base font-medium">Add a file</span>
            </div>
            
            {/* Display selected files */}
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-[#d8d6d6] rounded-lg px-3 py-2">
                    <span className="text-sm text-[#282a35]">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !category || !task || !description}
            className="w-full bg-[#55c4c8] text-[#282a35] py-6 rounded-full text-base font-medium hover:bg-[#4ab5b9] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : (submitButtonLabel || 'Create an order')}
          </Button>
        </div>
      </div>
    </div>
  )
}
