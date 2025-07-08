'use client'

import React, { useState } from 'react'
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
  const router = useRouter()
  const [serviceName, setServiceName] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

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
            Look for a specialist in your city
          </h2>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl  mx-auto">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Name of service"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="h-12 text-base rounded-full"
              />
            </div>

            <div className="flex-1 ">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="City" />
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
              Looking for a specialist
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
