
'use client'

import React from 'react'
import { SpecialistSearchForm } from '@/components/search/specialist-search-form'
import FAQSection from '@/components/landing/FAQ'
import { useRouter } from 'next/navigation'

interface SearchFormData {
  service: string
  city: string
  date: string
  description: string
}

export default function SearchPage() {
  const router = useRouter()

  const handleFormSubmit = (data: SearchFormData) => {
    console.log('Search form submitted:', data)
    
    const searchParams = new URLSearchParams()
    if (data.service) searchParams.set('service', data.service)
    if (data.city) searchParams.set('city', data.city)
    if (data.date) searchParams.set('date', data.date)
    if (data.description) searchParams.set('description', data.description)

    router.push(`/search/results?${searchParams.toString()}`)
  }

  return (
    <main className="min-h-screen">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SpecialistSearchForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </section>

      <FAQSection 
        backgroundColor="bg-gray-100"
        showTitle={true}
      />
    </main>
  )
}