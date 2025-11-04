'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export default function HowItWorksSection() {
  const t = useTranslations('landing.howItWorks')

  const steps = [
    {
      number: '01',
      title: t('step1.title'),
      description: t('step1.description'),
    },
    {
      number: '02',
      title: t('step2.title'),
      description: t('step2.description'),
    },
    {
      number: '03',
      title: t('step3.title'),
      description: t('step3.description'),
    },
  ]

  return (
    <section className="py-16 bg-white rounded-t-[60px]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-[64px] font-bold text-gray-900 mb-12">
            {t('title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="relative bg-[#f7f7f7] border-0 shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="text-4xl font-bold  mb-6">{step.number}</div>

                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
