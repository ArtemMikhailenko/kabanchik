"use client"

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function OrderDetailRedirect() {
  const params = useParams()
  const router = useRouter()
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    if (orderId) {
      router.replace(`/order/${orderId}`)
    }
  }, [orderId, router])

  return null
}
