import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('GET /api/orders/[id] - Starting request for order:', id)
    const authResult = await auth()
    const { userId } = authResult
    
    if (!userId) {
      console.log('No userId found in auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Authenticated user ID:', userId)

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        pro: true,
        customer: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    // Get the specific order with full details
    let order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        customer: {
          include: {
            user: true
          }
        },
        category: true,
        specialist: {
          include: {
            user: true
          }
        },
        responses: {
          include: {
            specialist: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check access level for this order
  const isOrderOwner = user.role === 'CUSTOMER' && user.customer && order.customerId === user.customer.id
  const proId = user.role === 'SPECIALIST' && user.pro ? user.pro.id : null
  const isAssignedSpecialist = proId ? order.specialistId === proId : false
  const hasResponded = proId ? order.responses.some(r => r.specialistId === proId) : false
    
    // Allow access if:
    // 1. User is the order owner (customer)
    // 2. User is the assigned specialist
    // 3. User has responded to this order
    // 4. User is a specialist and order is open (for browsing available orders)
    const hasAccess = isOrderOwner || isAssignedSpecialist || hasResponded || 
                      (user.role === 'SPECIALIST' && order.status === 'OPEN')

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    // Increment view count for browsing specialists (not for owners or already responded specialists)
    // Use a 24h cookie to avoid counting multiple refreshes from same browser
    const viewedCookieKey = `ov_${id}`
    const hasViewedCookie = req.cookies.get(viewedCookieKey)?.value === '1'
    let markViewedCookie = false
    if (user.role === 'SPECIALIST' && !isOrderOwner && !isAssignedSpecialist && !hasResponded && !hasViewedCookie) {
      await prisma.order.update({
        where: { id: id },
        data: { views: { increment: 1 } }
      })
      markViewedCookie = true
      // Refresh order data to get updated view count
      const updatedOrder = await prisma.order.findUnique({
        where: { id: id },
        include: {
          customer: { include: { user: true } },
          category: true,
          specialist: { include: { user: true } },
          responses: { include: { specialist: { include: { user: true } } } }
        }
      })
      if (updatedOrder) order = updatedOrder
    }
    
    // Determine if user should see full details or limited info
    const showFullDetails = isOrderOwner || isAssignedSpecialist || hasResponded

    // Generate readable order number from ID
    const orderNumber = `ORD-${order.id.slice(-6).toUpperCase()}`

    // Basic customer stats (reviews given by this customer)
    let reviewsCount = 0
    let positivePercentage = 0
    try {
      const totalReviews = await prisma.review.count({ where: { reviewerId: order.customer.user.id } })
      const positiveReviews = await prisma.review.count({ where: { reviewerId: order.customer.user.id, isPositive: true } })
      reviewsCount = totalReviews
      positivePercentage = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0
    } catch (e) {
      // Keep defaults if review aggregation fails
    }

    // Get specialist data if assigned
    let specialistData = null
    if (order.specialist) {
      const specialistProfile = await prisma.specialistProfile.findUnique({
        where: { proId: order.specialist.id }
      })

      specialistData = {
        id: order.specialist.id,
        userId: order.specialist.userId,
        name: order.specialist.user.name || 'Specialist',
        avatar: order.specialist.user.avatar || '/photo.png',
        reviewCount: specialistProfile?.reviewCount || 0,
        rating: specialistProfile?.rating ? Number(specialistProfile.rating) : 0
      }
    }

    // Format the order for frontend (real fields only)
    const formattedOrder = {
      id: order.id,
      title: order.title,
      orderNumber: orderNumber,
      views: order.views,
      categories: [
        'Freelancing',
        order.category.name
      ],
      createdAt: order.createdAt.toISOString(),
      // derive a soft deadline: 7 days from createdAt
      deadline: new Date(order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: getOrderStatusText(order.status),
      rawStatus: order.status,
      description: order.description,
      // do not invent expectation text; omit if not present in schema
      confidentialInfo: showFullDetails 
        ? 'The exact address, contacts, etc. will be available only to the selected specialist during the execution of the order'
        : 'Contact details will be available after response approval',
      location: order.location || null,
      customer: {
        name: showFullDetails ? (order.customer.user.name || 'Customer') : 'Customer',
        avatar: showFullDetails ? (order.customer.user.avatar || null) : null,
        reviewsCount,
        positivePercentage,
        createdDate: order.createdAt.toISOString(),
        approvedDate: null as string | null
      },
      specialist: specialistData,
      // Check if this is a direct customer offer (customer sent order to specialist)
      isDirectOffer: proId ? order.responses.some(r => 
        r.specialistId === proId && r.message === 'Direct customer offer'
      ) : false,
      // Add access level info for frontend
      accessLevel: {
        isOwner: isOrderOwner,
        isAssigned: isAssignedSpecialist,
        hasResponded: hasResponded,
        canRespond: user.role === 'SPECIALIST' && order.status === 'OPEN' && !isAssignedSpecialist && !hasResponded,
        showFullDetails: showFullDetails
      }
    }

    const res = NextResponse.json({ 
      order: formattedOrder,
      user: {
        id: user.id,
        role: user.role
      }
    })
    if (markViewedCookie) {
      res.cookies.set(viewedCookieKey, '1', {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      })
    }
    return res

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

function getOrderStatusText(status: string): string {
  switch (status) {
    case 'OPEN':
      return 'Waiting for a specialist'
    case 'IN_PROGRESS':
      return 'Order in progress'
    case 'COMPLETED':
      return 'Completed'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return 'Unknown status'
  }
}
