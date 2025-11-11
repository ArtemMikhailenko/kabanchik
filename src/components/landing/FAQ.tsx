'use client'

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface FAQSectionProps {
  backgroundColor?: string
  showTitle?: boolean
  className?: string
}

export default function FAQSection({
  backgroundColor = 'bg-[#ffd2aa]',
  showTitle = true,
  className = '',
}: FAQSectionProps) {
  const t = useTranslations('landing.faq')
  const [openItems, setOpenItems] = useState<number[]>([1, 2, 3, 4, 5])
  const [showAll, setShowAll] = useState(false)

  const faqs = [
    {
      id: 1,
      question: t('q1.question'),
      answer: t('q1.answer'),
    },
    {
      id: 2,
      question: t('q2.question'),
      answer: t('q2.answer'),
    },
    {
      id: 3,
      question: t('q3.question'),
      answer: t('q3.answer'),
    },
    {
      id: 4,
      question: t('q4.question'),
      answer: t('q4.answer'),
    },
    {
      id: 5,
      question: t('q5.question'),
      answer: t('q5.answer'),
    },
    {
      id: 6,
      question: t('q6.question'),
      answer: t('q6.answer'),
    },
    {
      id: 7,
      question: t('q7.question'),
      answer: t('q7.answer'),
    },
    {
      id: 8,
      question: t('q8.question'),
      answer: t('q8.answer'),
    },
    {
      id: 9,
      question: t('q9.question'),
      answer: t('q9.answer'),
    },
    {
      id: 10,
      question: t('q10.question'),
      answer: t('q10.answer'),
    },
  ]

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <section className={`bg-white ${className}`}>
      <div
        className={`${backgroundColor} py-16 rounded-t-[30px] md:rounded-t-[60px]`}
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto">
            <div
              className={`grid grid-cols-1 ${showTitle ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-12`}
            >
              {showTitle && (
                <div className="lg:col-span-1">
                  <h2 className="text-3xl md:text-[56px] font-bold text-gray-900 leading-tight whitespace-pre-line">
                    {t('title')}
                  </h2>
                </div>
              )}

              <div className={showTitle ? 'lg:col-span-2' : 'lg:col-span-1'}>
                <div className="space-y-4">
                  {(showAll ? faqs : faqs.slice(0, 5)).map((faq) => {
                    const isOpen = openItems.includes(faq.id)

                    return (
                      <div key={faq.id} className="border-b border-gray-600">
                        <button
                          onClick={() => toggleItem(faq.id)}
                          className="w-full flex items-start justify-between py-6 text-left group"
                        >
                          <div className="mr-4 mt-1 flex-shrink-0">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center group-hover:border-gray-800 transition-colors">
                              {isOpen ? (
                                <X className="w-4 h-4 text-gray-600" />
                              ) : (
                                <Plus className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 pr-4">
                              {faq.question}
                            </h3>

                            {isOpen && (
                              <div className="mt-4 pr-4">
                                <p className="text-gray-600 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>
                {faqs.length > 5 && (
                  <div className="mt-6">
                    <button
                      className="px-8 py-3 rounded-full bg-white text-black font-medium shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
                      onClick={() => setShowAll((s) => !s)}
                      aria-expanded={showAll}
                    >
                      {showAll ? t('showLess') : t('showMore')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
