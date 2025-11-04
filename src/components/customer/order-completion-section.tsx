'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface Specialist {
  id: string
  userId: string
  name: string
  avatar: string
  reviewCount: number
  rating: number
}

interface OrderCompletionProps {
  orderId: string
  specialist: Specialist
}

export function OrderCompletionSection({ orderId, specialist }: OrderCompletionProps) {
  const t = useTranslations('review')
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const positivePercentage = Math.round((specialist.rating / 5) * 100)

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: reviewText,
          action: 'complete'
        })
      })

      if (response.ok) {
        router.push('/profile?tab=order-history')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseOrder = async () => {
    if (!confirm('Are you sure you want to close this order without leaving a review?')) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel'
        })
      })

      if (response.ok) {
        router.push('/profile?tab=order-history')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to close order')
      }
    } catch (error) {
      console.error('Error closing order:', error)
      alert('Failed to close order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-9">
      {/* Performer Section */}
      <div className="space-y-3">
        <h3 className="text-xl font-medium text-[#282a35] leading-[140%]">
          Performer
        </h3>

        {/* Specialist Card */}
        <div className="bg-white border border-[#e6e6e6] rounded-3xl">
          <div className="px-6 pt-6 pb-12 flex items-end gap-4 xl:gap-8">
            {/* Left: Avatar + Name + Location */}
            <div className="flex items-start gap-4 flex-shrink min-w-0 max-w-[280px]">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={specialist.avatar}
                  alt={specialist.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-4 min-w-0 overflow-hidden">
                <h4 className="text-lg xl:text-2xl font-bold text-[#282a35] leading-[150%] truncate">
                  {specialist.name}
                </h4>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#a3a3a3] flex-shrink-0" />
                  <span className="text-sm text-[#a3a3a3]">Kyiv</span>
                </div>
              </div>
            </div>

            {/* Center: Reviews + Positive + Rating */}
            <div className="flex items-center gap-3 xl:gap-6 flex-shrink-0">
              {/* Reviews & Positive */}
              <div className="flex items-center gap-2">
                {/* Reviews */}
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-lg xl:text-2xl font-medium text-[#282a35] leading-[140%]">
                    {specialist.reviewCount}
                  </span>
                  <span className="text-xs xl:text-sm text-[#282a35] leading-[150%]">
                    {t('reviews', { ns: 'specialist' })}
                  </span>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-[#a3a3a3]" />

                {/* Positive */}
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-lg xl:text-2xl font-medium text-[#282a35] leading-[140%]">
                    {positivePercentage}%
                  </span>
                  <span className="text-xs xl:text-sm text-[#282a35] leading-[150%]">
                    {t('positive', { ns: 'specialist' })}
                  </span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="xl:w-6 xl:h-6"
                  >
                    <path
                      d="M12.0066 2.00201L14.8232 8.82868L22.0132 9.56535L16.5466 14.3987L18.1999 21.4387L12.0066 17.782L5.81323 21.4387L7.46656 14.3987L2 9.56535L9.18989 8.82868L12.0066 2.00201Z"
                      fill={star <= Math.round(specialist.rating) ? '#FFA657' : '#e6e6e6'}
                      stroke={star <= Math.round(specialist.rating) ? '#FFA657' : '#e6e6e6'}
                    />
                  </svg>
                ))}
              </div>
            </div>

            {/* Right: View Profile Button */}
            <Link
              href={`/specialists/${specialist.userId}`}
              className="h-[51px] flex items-center justify-center px-6 xl:px-9 bg-[#55c4c8] text-[#282a35] text-sm xl:text-base font-medium rounded-[50px] hover:bg-[#4ab5b9] transition-colors leading-[120%] whitespace-nowrap ml-auto flex-shrink-0"
            >
              {t('viewProfile', { ns: 'specialist' })}
            </Link>
          </div>
        </div>
      </div>

      {/* Rate the cooperation */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-[#282a35] leading-[140%]">
          {t('leaveReview')}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <span className="text-base text-[#282a35]">{t('rating')}:</span>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0066 2.00201L14.8232 8.82868L22.0132 9.56535L16.5466 14.3987L18.1999 21.4387L12.0066 17.782L5.81323 21.4387L7.46656 14.3987L2 9.56535L9.18989 8.82868L12.0066 2.00201Z"
                    fill="none"
                    stroke={star <= (hoverRating || rating) ? '#FFA657' : '#e6e6e6'}
                    strokeWidth="2"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Review Textarea */}
        <div className="w-full max-w-[551px]">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={t('comment')}
            className="w-full h-[118px] bg-white border border-[#d8d6d6] rounded-2xl px-6 py-4 text-sm text-[#282a35] placeholder:text-[#a3a3a3] resize-none focus:outline-none focus:border-[#55c4c8]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || rating === 0}
            className="px-9 py-3.5 bg-[#55c4c8] text-[#282a35] text-base font-medium rounded-[50px] hover:bg-[#4ab5b9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('sending', { ns: 'common' }) : t('sendReview')}
          </button>

          <button
            onClick={handleCloseOrder}
            disabled={isSubmitting}
            className="px-9 py-3.5 bg-white border border-[#ffa657] text-[#282a35] text-base font-medium rounded-[50px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <X className="w-6 h-6 text-[#ffa657]" />
            {t('closeOrder')}
          </button>
        </div>
      </div>
    </div>
  )
}
