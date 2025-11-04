import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/orders/all - Starting request')
    const authResult = await auth()
    const { userId } = authResult
    
    if (!userId) {
      console.log('No userId found in auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all orders except current user's orders for "similar orders" section
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: user.id }
    })

    // Get orders from other customers (excluding current user's orders)
    const orders = await prisma.order.findMany({
      where: customer ? {
        customerId: { not: customer.id }
      } : {},
      include: {
        category: true,
        customer: {
          include: {
            user: true
          }
        },
        specialist: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to 20 most recent orders
    })

    // Transform orders to match expected format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      title: order.title,
      description: order.description,
      location: order.location,
      category: order.category.name,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      user: {
        name: order.customer.user.name || 'Anonymous User',
        avatar: order.customer.user.avatar
      }
    }))

    return NextResponse.json({ orders: transformedOrders })

  } catch (error) {
    console.error('Error fetching all orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
