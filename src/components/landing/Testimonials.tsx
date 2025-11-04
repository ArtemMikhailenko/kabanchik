'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

const TestimonialCard = ({
  name,
  position,
  text,
  rating,
}: {
  name: string
  position: string
  text: string
  rating: number
}) => (
  <Card className="bg-white border border-[#e6e6e6] rounded-[24px] shadow-sm h-full max-h-[280px] p-[30px]">
    <CardContent className="">
      <div className="flex items-start gap-[22px]">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <div className="flex flex-col gap-[6px] flex-1">
          <div className="flex gap-2 mb-3">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-[#ffa657] fill-current" />
            ))}
          </div>
          <p className="text-[#282a35] leading-[150%] mb-[6px] text-base">
            {text}
          </p>

          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-[#282a35] text-xl leading-[150%]">
              {name}
            </h4>
            <p className="text-base text-[#a3a3a3] leading-[150%]">
              {position}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function TestimonialsSection() {
  const t = useTranslations('landing.testimonials')
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      id: 1,
      name: t('customer1.name'),
      position: t('customer1.position'),
      rating: 5,
      text: t('customer1.text'),
    },
    {
      id: 2,
      name: t('customer2.name'),
      position: t('customer2.position'),
      rating: 5,
      text: t('customer2.text'),
    },
    {
      id: 3,
      name: t('customer3.name'),
      position: t('customer3.position'),
      rating: 5,
      text: t('customer3.text'),
    },
    {
      id: 4,
      name: t('customer4.name'),
      position: t('customer4.position'),
      rating: 5,
      text: t('customer4.text'),
    },
    {
      id: 5,
      name: t('customer5.name'),
      position: t('customer5.position'),
      rating: 5,
      text: t('customer5.text'),
    },
    {
      id: 6,
      name: t('customer6.name'),
      position: t('customer6.position'),
      rating: 5,
      text: t('customer6.text'),
    },
  ]

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft
      const cardWidth = 350
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(Math.min(newIndex, testimonials.length - 1))
    }
  }, [testimonials.length])

  const goToSlide = useCallback((index: number) => {
    if (scrollRef.current) {
      const cardWidth = 350
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  const paginationDots = Array.from({ length: 5 }, (_, i) => i)

  return (
    <section className="pt-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-[64px] font-bold text-gray-900">
              {t('title')}
            </h2>

            <div className="flex space-x-2">
              {paginationDots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-teal-400' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mr-4"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              marginRight: 'calc(-50vw + 50%)',
              paddingRight: 'calc(50vw - 50%)',
            }}
            onScroll={handleScroll}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 max-w-[580px] ml-4 first:ml-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <TestimonialCard
                  name={testimonial.name}
                  position={testimonial.position}
                  text={testimonial.text}
                  rating={testimonial.rating}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex justify-end">
        <div className="max-w-6xl  ">
          <img src="/main/testimonial.png" alt="" className="max-w-[514px]" />
        </div>
      </div>

      {/* TODO: remove this */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
