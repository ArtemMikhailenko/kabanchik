'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SearchFormData {
  service: string
  city: string
  date: string
  description: string
}

interface SpecialistSearchFormProps {
  onSubmit: (data: SearchFormData) => void
}

interface Category {
  id: string
  name: string
  slug: string
}

export function SpecialistSearchForm({ onSubmit }: SpecialistSearchFormProps) {
  const t = useTranslations('search')
  const [formData, setFormData] = useState<SearchFormData>({
    service: '',
    city: '',
    date: '',
    description: ''
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/hierarchical')
        if (response.ok) {
          const data = await response.json()
          // Extract only parent categories from the response structure
          const parentCategories: Category[] = []
          if (data.categories) {
            data.categories.forEach((parent: any) => {
              parentCategories.push({
                id: parent.id,
                name: parent.title,
                slug: parent.slug
              })
              // Don't add subcategories (services) to the select
            })
          }
          setCategories(parentCategories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const cities = [
    'Kyiv',
    'Kharkiv',
    'Odesa',
    'Dnipro',
    'Lviv',
    'Zaporizhzhia',
    'Kryvyi Rih',
    'Mykolaiv'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <section className="flex justify-center py-16 bg-white">
      <div className="
        relative
        w-[1200px] h-[464px]
        bg-[#55c4c8] rounded-[24px]
        overflow-hidden
      ">
        {/* Секция формы (левый блок) */}
        <form
          onSubmit={handleSubmit}
          className="
            absolute left-[56px] top-[54px]
            w-[587px] h-[333px]
            flex flex-col gap-[12px]
          "
        >
          <div className="relative">
            <Input
              type="date"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="
                w-full h-[54px]
                bg-white rounded-[40px]
                px-[20px] py-[15px]
                text-gray-600
              "
            />
            <Calendar className="
              absolute right-[20px] top-1/2 transform -translate-y-1/2
              w-5 h-5 text-gray-400
            " />
          </div>
          {/* 1) Service + City + Date in row */}
          <div className="flex gap-[12px]">
            <Select
              value={formData.service}
              onValueChange={(v) => setFormData(prev => ({ ...prev, service: v }))}
            >
              <SelectTrigger className="
                w-[279px] h-[54px]
                bg-white rounded-[40px]
                px-[20px] py-[15px]
                flex justify-between items-center
              ">
                <SelectValue placeholder={loadingCategories ? t('loading') : t('service')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.city}
              onValueChange={(v) => setFormData(prev => ({ ...prev, city: v }))}
            >
              <SelectTrigger className="
                w-[279px] h-[54px]
                bg-white rounded-[40px]
                px-[20px] py-[15px]
                flex justify-between items-center
              ">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                  <SelectValue placeholder={t('city')} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {cities.map(c => (
                  <SelectItem key={c} value={c.toLowerCase()}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2) Date picker */}
          

          {/* 3) Description */}
          <Textarea
            placeholder={t('descriptionPlaceholder')}
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="
              w-full h-[110px]
              bg-white rounded-[16px]
              px-[24px] pt-[16px] pb-[21px]
              resize-none text-gray-600
            "
          />

          {/* 4) Submit */}
          <Button
            type="submit"
            className="
              w-full h-[55px]
              bg-[#FFA657] rounded-full
              px-[36px] py-[18px]
              text-[16px] font-medium text-[#282a35]
              flex justify-center items-center gap-[10px]
              hover:bg-orange-500 transition-colors
            "
          >
            {t('submitButton')}
          </Button>
        </form>

        {/* Текстовый блок (правый) */}
        <div className="
          absolute left-[717px] top-[44px]
          w-[413px] h-[257px]
          flex flex-col gap-[13px]
        ">
          <h2 className="
            text-[56px] font-bold text-[#282a35]
            leading-[66px]
          ">
            {t('title').toUpperCase()}
          </h2>
          <p className="
            text-[20px] font-medium text-[#282a35]/80
            leading-[140%]
            w-[400px] h-[112px]
          ">
            Lorem ipsum dolor sit amet consectetur adipiscing elit tortor eu dolorol egestas morbi sem vulputate etiam facilisis pellentesque ut quis.
          </p>
        </div>

        <div className="absolute right-10 bottom-15 flex-shrink-0 ">
          <img src="/arrow-search.png" alt="" className="w-auto h-auto max-w-[414px]" />
        </div>
      </div>
    </section>
  )
}
