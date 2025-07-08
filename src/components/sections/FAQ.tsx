'use client'

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

const faqs = [
  {
    id: 1,
    question:
      'Lorem ipsum dolor sit amet consectetur. Vitae euismod sollicitudin morbi ultrices ac turpis tristique.',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 2,
    question:
      'Lorem ipsum dolor sit amet consectetur. Vitae euismod sollicitudin morbi ultrices ac turpis tristique.',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 3,
    question:
      'Lorem ipsum dolor sit amet consectetur. Vitae euismod sollicitudin morbi ultrices ac turpis tristique.',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 4,
    question:
      'Lorem ipsum dolor sit amet consectetur. Vitae euismod sollicitudin morbi ultrices ac turpis tristique.',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 5,
    question:
      'Lorem ipsum dolor sit amet consectetur. Vitae euismod sollicitudin morbi ultrices ac turpis tristique.',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
  {
    id: 6,
    question:
      'Lorem ipsum dolor sit amet consectetur. Vitae euismod sollicitudin morbi ultrices ac turpis tristique.',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Ut egestas diam eget nulla mauris ut. Dolor nibh at sed ultrices imperdiet condimentum suspendisse gravida nisl. Sed mauris nibh imperdiet sit. Praesent nam suspendisse sit nulla vestibulum.',
  },
]

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([1])

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <section className=" bg-white">
      <div className="bg-[#ffd2aa] py-16 rounded-t-[60px]">
        <div className="container mx-auto px-4">
          <div className=" mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h2 className="text-3xl md:text-[56px] font-bold text-gray-900 leading-tight">
                  FREQUENTLY
                  <br />
                  ASKED
                  <br />
                  QUESTIONS
                </h2>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {faqs.map((faq) => {
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
