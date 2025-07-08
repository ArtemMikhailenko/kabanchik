'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, User } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Matt Cannon',
    position: 'Head of Marketing',
    rating: 5,
    text: 'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    position: 'Product Manager',
    rating: 5,
    text: 'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 3,
    name: 'David Wilson',
    position: 'Design Director',
    rating: 5,
    text: 'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 4,
    name: 'Emma Davis',
    position: 'UX Designer',
    rating: 5,
    text: 'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 5,
    name: 'Michael Brown',
    position: 'Frontend Developer',
    rating: 5,
    text: 'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 6,
    name: 'Anna Taylor',
    position: 'UI/UX Designer',
    rating: 5,
    text: 'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
]

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0]
}) => (
  <Card className="bg-white border border-gray-100 shadow-sm h-full">
    <CardContent className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <div className="flex flex-col">
          <div className="flex mb-2">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-orange-400 fill-current" />
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed mb-6 text-sm">
            {testimonial.text}
          </p>

          <div>
            <h4 className="font-semibold text-gray-900 text-base">
              {testimonial.name}
            </h4>
            <p className="text-sm text-gray-500">{testimonial.position}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft
      const cardWidth = 350
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(Math.min(newIndex, testimonials.length - 1))
    }
  }, [])

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
              Testimonials
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
            {/* TODO: update to shadcn carousel */}
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-80 md:w-96 ml-4 first:ml-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <TestimonialCard testimonial={testimonial} />
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
