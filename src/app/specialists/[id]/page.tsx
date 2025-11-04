'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Clock, Shield, CheckCircle } from 'lucide-react'
import PopularServices from '@/components/specialists/popular-services'
import { useTranslations } from 'next-intl'

interface Specialist {
  id: string
  name: string
  photo: string
  city: string
  rating: number
  reviewCount: number
  positivePercentage: number
  completedOrders: number
  description: string
  isOnline: boolean
  lastSeen: string
  services: Service[]
  reviews: Review[]
  portfolioItems: PortfolioItem[]
  mainCategory: {
    id: string
    name: string
    slug: string
  } | null
}

interface Service {
  id: string
  title: string
  description: string
  icon: string
}

interface Review {
  id: string
  customerName: string
  customerPhoto: string
  date: string
  rating: number
  text: string
  serviceTitle: string
  qualityOfWork: number
  courtesy: number
  punctuality: number
}

interface PortfolioItem {
  id: string
  images: string[]
  tags: string[]
}

export default function SpecialistProfilePage() {
  const t = useTranslations('specialist')
  const params = useParams()
  const router = useRouter()
  const specialistId = params.id as string
  const [specialist, setSpecialist] = useState<Specialist | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'photos'>('photos')

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/specialists/${specialistId}`)
        if (response.ok) {
          const data = await response.json()
          setSpecialist(data)
        }
      } catch (error) {
        console.error('Error fetching specialist:', error)
      } finally {
        setLoading(false)
      }
    }

    if (specialistId) {
      fetchSpecialist()
    }
  }, [specialistId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading specialist profile...</div>
      </div>
    )
  }

  if (!specialist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Specialist not found</div>
      </div>
    )
  }

  const handleJobOffer = () => {
    router.push(`/order/create/${specialistId}`)
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Specialist Header */}
      <section className="py-6">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Photo + Online Status */}
            <div className="col-span-3">
              <div className="w-[280px] h-[280px] rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img 
                  src={specialist.photo || '/placeholder-avatar.jpg'} 
                  alt={specialist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online Status */}
              <div className="bg-[#d4f2f3] rounded-2xl px-4 py-3 flex items-center gap-2 w-[280px]">
                <div className={`w-2.5 h-2.5 rounded-full ${specialist.isOnline ? 'bg-[#34979a]' : 'bg-gray-400'}`}></div>
                <span className="text-[#34979a] text-sm font-medium">
                  {specialist.isOnline ? 'Online' : 'Offline'} {specialist.lastSeen}
                </span>
              </div>
            </div>

            {/* Main Info */}
            <div className="col-span-6 bg-white rounded-2xl p-6">
              {/* Name and Location */}
              <div className="mb-6">
                <h1 className="text-[32px] font-bold text-[#282a35] mb-3">{specialist.name}</h1>
                <div className="flex items-center gap-2 text-[#282a35]">
                  <MapPin size={20} />
                  <span className="text-sm">{specialist.city}</span>
                </div>
              </div>

              {/* Stats and Rating */}
              <div className="flex items-center gap-9 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[#282a35]">{specialist.reviewCount}</div>
                    <div className="text-sm text-[#282a35]">reviews</div>
                  </div>
                  <div className="w-px h-9 bg-[#a3a3a3]"></div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[#282a35]">{specialist.positivePercentage}%</div>
                    <div className="text-sm text-[#282a35]">{t('positive')}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={24}
                      className={star <= specialist.rating ? "fill-[#ffa657] text-[#ffa657]" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-[#282a35] text-base leading-6 mb-6">{specialist.description}</p>

              {/* Verification Badges */}
              <div className="flex items-center gap-9">
                <div className="flex items-center gap-2 text-[#34979a]">
                  <CheckCircle size={20} />
                  <span className="text-sm font-medium">{t('verifiedInformation')}</span>
                </div>
                <div className="flex items-center gap-2 text-[#34979a]">
                  <Shield size={20} />
                  <span className="text-sm font-medium">{t('customerSafety')}</span>
                </div>
              </div>
            </div>

            {/* Job Offer Section */}
            <div className="col-span-3">
              {/* Completed Orders */}
              <div className="bg-white rounded-lg p-6 mb-4 w-[282px]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#282a35]">{t('completedOrders')}</span>
                  <div className="w-px h-9 bg-[#282a35] opacity-20"></div>
                  <span className="text-2xl font-normal text-[#282a35] pl-2">{specialist.completedOrders}</span>
                </div>
              </div>

              {/* Job Offer Button */}
              <Button 
                onClick={handleJobOffer}
                className="bg-[#55c4c8] hover:bg-[#4ab5b9] text-[#282a35] font-medium text-base w-[282px] h-[51px] rounded-[50px]"
              >
                {t('jobOffer')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-9">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-9">
              <div className="bg-white rounded-2xl px-0 py-10">
                {/* Tab Navigation */}
                <div className="border-b border-[#282a35] border-opacity-20 mb-6 px-6">
                  <div className="flex gap-[120px] pb-3">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`text-2xl font-bold pb-3 ${
                    activeTab === 'services' 
                      ? 'text-[#282a35]' 
                      : 'text-[#a3a3a3]'
                  }`}
                >
                  {t('services')}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`text-2xl font-bold pb-3 ${
                    activeTab === 'reviews' 
                      ? 'text-[#282a35]' 
                      : 'text-[#a3a3a3]'
                  }`}
                >
                  {t('reviewsTab')}
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`text-2xl font-bold pb-3 ${
                    activeTab === 'photos' 
                      ? 'text-[#282a35]' 
                      : 'text-[#a3a3a3]'
                  }`}
                >
                  {t('photosOfWorks')}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="px-6">
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {specialist.services.map((service) => (
                    <div key={service.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#55c4c8] rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">🔧</span>
                        </div>
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {specialist.reviews.length === 0 ? (
                    <div className="text-center py-12 text-[#a3a3a3]">
                      {t('noReviewsYet')}
                    </div>
                  ) : (
                    <>
                      {/* Summary Stats */}
                      <div className="bg-[#d4f4f4] rounded-2xl px-9 py-5">
                        <div className="flex items-center justify-between">
                          {/* Left: Reviews + Positive */}
                          <div className="flex items-center gap-3">
                            {/* Reviews */}
                            <div className="flex flex-col gap-1">
                              <span className="text-4xl font-normal text-[#282a35] leading-[140%]">
                                {specialist.reviewCount}
                              </span>
                              <span className="text-sm text-[#282a35] leading-[150%]">
                                {t('reviews')}
                              </span>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-[53px] bg-white" />

                            {/* Positive */}
                            <div className="flex flex-col gap-1">
                              <span className="text-4xl font-normal text-[#282a35] leading-[140%]">
                                {specialist.positivePercentage}%
                              </span>
                              <span className="text-sm text-[#282a35] leading-[150%]">
                                {t('positive')}
                              </span>
                            </div>
                          </div>

                          {/* Right: Quality, Courtesy, Punctuality */}
                          <div className="flex items-center gap-9">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#282a35]">{t('qualityOfWork')}</span>
                              <span className="text-sm font-bold text-[#282a35]">99%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#282a35]">{t('courtesy')}</span>
                              <span className="text-sm font-bold text-[#282a35]">99%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#282a35]">{t('punctuality')}</span>
                              <span className="text-sm font-bold text-[#282a35]">99%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-6">
                        {specialist.reviews.map((review) => (
                          <div 
                            key={review.id} 
                            className="bg-white border border-[#e6e6e6] rounded-3xl px-6 pt-8 pb-9"
                          >
                            <div className="flex items-start gap-[22px]">
                              {/* Avatar */}
                              <img 
                                src={review.customerPhoto || '/placeholder-avatar.jpg'} 
                                alt={review.customerName}
                                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                              />
                              
                              {/* Content */}
                              <div className="flex-1 flex flex-col gap-1">
                                {/* Name */}
                                <h4 className="text-xl font-bold text-[#282a35] leading-[150%]">
                                  {review.customerName}
                                </h4>
                                
                                {/* Date */}
                                <div className="text-sm text-[#a3a3a3] leading-[150%]">
                                  {new Date(review.date).toLocaleDateString('en-GB')}
                                </div>
                                
                                {/* Stars + Review Text */}
                                <div className="flex flex-col gap-3 mt-[3px]">
                                  {/* Stars */}
                                  <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M12.0066 2.00201L14.8232 8.82868L22.0132 9.56535L16.5466 14.3987L18.1999 21.4387L12.0066 17.782L5.81323 21.4387L7.46656 14.3987L2 9.56535L9.18989 8.82868L12.0066 2.00201Z"
                                          fill={star <= review.rating ? '#FFA657' : '#e6e6e6'}
                                          stroke={star <= review.rating ? '#FFA657' : '#e6e6e6'}
                                        />
                                      </svg>
                                    ))}
                                  </div>
                                  
                                  {/* Review Text */}
                                  <p className="text-base text-[#282a35] leading-[150%]">
                                    {review.text}
                                  </p>
                                </div>
                                
                                {/* Service Title */}
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-[#282a35] leading-[150%]">
                                    {t('reviewOnRequest')}
                                  </span>
                                  <span className="text-sm font-medium text-[#34979a] leading-[130%]">
                                    {review.serviceTitle}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'photos' && (
                <div>
                  {specialist.portfolioItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      {t('noPortfolioYet')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-6">
                      {specialist.portfolioItems.map((item) => (
                        <div key={item.id} className="space-y-2">
                          {/* Image */}
                          <div className="w-[243px] h-[243px] rounded-lg overflow-hidden bg-gray-100">
                            {item.images[0] && (
                              <img 
                                src={item.images[0]} 
                                alt="Portfolio item"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="px-3 py-1 text-xs bg-gray-100 text-[#646464] border border-[#646464] rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <PopularServices categorySlug={specialist.mainCategory?.slug || null} />
    </main>
  )
}
