'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface Category {
  id: string
  name: string
  slug: string
}

const cities = [
  'Kyiv',
  'Kharkiv',
  'Odesa',
  'Dnipro',
  'Lviv',
  'Zaporizhzhia',
  'Kryvyi Rih',
  'Mykolaiv',
  'Mariupol',
  'Vinnytsia',
]

export default function SearchSpecialistSection() {
  const t = useTranslations('landing.searchSpecialist')
  const router = useRouter()
  const [serviceName, setServiceName] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
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

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    if (serviceName) searchParams.set('service', serviceName)
    if (selectedCity) searchParams.set('city', selectedCity)

    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className=" mx-auto text-center">
          <h2 className="text-3xl md:text-[64px] font-bold text-[#55c4c8] mb-12">
            {t('title')}
          </h2>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl  mx-auto">
            <div className="flex-1">
              <Select value={serviceName} onValueChange={setServiceName}>
                <SelectTrigger className="h-12 text-base rounded-full">
                  <SelectValue placeholder={loadingCategories ? t('loading') : t('serviceName')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 ">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={t('city')} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city.toLowerCase()}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearch}
              className="bg-[#ffa657] hover:bg-orange-500 text-black px-8 h-12 text-base font-medium rounded-full"
            >
              {t('searchButton')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
