import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rating, comment, action } = await request.json()
    const orderId = params.id

    // Get user and customer
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { customer: true }
    })

    if (!user?.customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        specialist: {
          include: {
            user: true,
            profile: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify order belongs to customer
    if (order.customerId !== user.customer.id) {
      return NextResponse.json({ error: 'Not your order' }, { status: 403 })
    }

    // Verify order is in progress
    if (order.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Order is not in progress' }, { status: 400 })
    }

    if (action === 'cancel') {
      // Cancel order
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED'
        }
      })

      return NextResponse.json({ success: true, message: 'Order cancelled' })
    }

    // Complete order with review
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
    }

    if (!order.specialistId) {
      return NextResponse.json({ error: 'No specialist assigned' }, { status: 400 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        orderId: order.id,
        reviewerId: user.id,
        specialistId: order.specialist!.userId,
        rating,
        comment: comment || '',
        isPositive: rating >= 4
      }
    })

    // Update order status to completed
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED'
      }
    })

    // Update specialist profile stats
    if (order.specialist?.profile) {
      const allReviews = await prisma.review.findMany({
        where: {
          specialistId: order.specialist.userId
        }
      })

      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      const reviewCount = allReviews.length

      await prisma.specialistProfile.update({
        where: { proId: order.specialistId },
        data: {
          rating: avgRating,
          reviewCount
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      review,
      message: 'Order completed and review submitted' 
    })
  } catch (error) {
    console.error('Error completing order:', error)
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    )
  }
}
