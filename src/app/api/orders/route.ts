import { NextRequest, NextResponse } from 'next/server'
import { auth, createClerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Найдем пользователя и определим его роль
    let user: any = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        pro: true,
        customer: true
      }
    })

    if (!user) {
      // Be resilient: if user is not yet in our DB, don't fail the dashboard.
      // Try to create a minimal user record from Clerk, otherwise return empty list.
      try {
        console.warn('API /orders: DB user not found, attempting lightweight bootstrap from Clerk for', userId)
        const { createClerkClient } = await import('@clerk/nextjs/server')
        const clerkClient = createClerkClient({
          secretKey: process.env.CLERK_SECRET_KEY!,
        })
        const clerkUser = await clerkClient.users.getUser(userId)
        const primaryEmail = clerkUser.emailAddresses.find(
          (e) => e.id === clerkUser.primaryEmailAddressId
        )?.emailAddress

        // Role is optional in our schema; we keep it undefined if can't infer
        const roleFromMetadata = (clerkUser.publicMetadata?.role || clerkUser.unsafeMetadata?.role) as
          | 'SPECIALIST'
          | 'CUSTOMER'
          | undefined

        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: primaryEmail || 'unknown@example.com',
            name: clerkUser.firstName || clerkUser.username || null,
            role: roleFromMetadata as any,
          },
        })

        console.log('API /orders: Bootstrap user created with id', user.id)
      } catch (e) {
        console.warn('API /orders: Bootstrap failed or Clerk unavailable, returning empty list')
        return NextResponse.json({ orders: [], total: 0 })
      }
    }

    console.log('API: User found:', {
      email: user?.email,
      role: user?.role,
      hasProProfile: !!user?.pro,
      hasCustomerProfile: !!user?.customer
    })

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'

    let orders: any[] = []

  if (user?.role === 'SPECIALIST' && user?.pro) {
      // Для специалиста
      switch (type) {
        case 'at-work':
          // Заказы в работе у специалиста
          orders = await prisma.order.findMany({
            where: {
              specialistId: user.pro.id,
              status: 'IN_PROGRESS'
            },
            include: {
              customer: {
                include: {
                  user: true
                }
              },
              category: true
            },
            orderBy: {
              updatedAt: 'desc'
            }
          })
          break

        case 'suggestions':
          // Заказы где специалист откликнулся, но еще не назначен
          orders = await prisma.order.findMany({
            where: {
              status: 'OPEN',
              responses: {
                some: {
                  specialistId: user.pro.id
                }
              },
              specialistId: null // Еще не назначен специалист
            },
            include: {
              customer: {
                include: {
                  user: true
                }
              },
              category: true,
              responses: {
                where: {
                  specialistId: user.pro.id
                }
              }
            },
            orderBy: {
              updatedAt: 'desc'
            }
          })
          break

        case 'all':
        default:
          // Все заказы специалиста
          orders = await prisma.order.findMany({
            where: {
              OR: [
                { specialistId: user.pro.id },
                {
                  responses: {
                    some: {
                      specialistId: user.pro.id
                    }
                  }
                }
              ]
            },
            include: {
              customer: {
                include: {
                  user: true
                }
              },
              category: true
            },
            orderBy: {
              updatedAt: 'desc'
            }
          })
          break
      }
  } else if (user?.role === 'CUSTOMER' && user?.customer) {
      // Для заказчика
      console.log('API: Processing CUSTOMER orders, type:', type)
  console.log('API: Customer ID:', user.customer.id)
      
      switch (type) {
        case 'at-work':
          // Заказы заказчика, которые в работе
          console.log('API: Fetching at-work orders for customer')
          orders = await prisma.order.findMany({
            where: {
              customerId: user.customer.id,
              status: 'IN_PROGRESS'
            },
            include: {
              specialist: {
                include: {
                  user: true
                }
              },
              category: true,
              responses: true
            },
            orderBy: {
              updatedAt: 'desc'
            }
          })
          console.log('API: Found at-work orders:', orders.length)
          break
        
        case 'suggestions':
          // Заказы заказчика, на которые есть отклики
          console.log('API: Fetching suggestions orders for customer')
          orders = await prisma.order.findMany({
            where: {
              customerId: user.customer.id,
              status: 'OPEN',
              responses: {
                // По крайней мере один отклик
                some: { id: { not: '' } }
              }
            },
            include: {
              specialist: {
                include: {
                  user: true
                }
              },
              category: true,
              responses: {
                include: {
                  specialist: {
                    include: {
                      user: true
                    }
                  }
                }
              }
            },
            orderBy: {
              updatedAt: 'desc'
            }
          })
          console.log('API: Found suggestions orders:', orders.length)
          break

        case 'all':
        default:
          // Все заказы заказчика
          console.log('API: Fetching all orders for customer')
          orders = await prisma.order.findMany({
            where: {
              customerId: user.customer.id
            },
            include: {
              specialist: {
                include: {
                  user: true
                }
              },
              category: true,
              responses: true
            },
            orderBy: {
              updatedAt: 'desc'
            }
          })
          console.log('API: Found all orders:', orders.length)
          break
      }
    }

    // Преобразуем в формат для frontend
  const formattedOrders = orders.map((order) => ({
      id: order?.id ?? 'unknown',
      title: order?.title ?? 'Untitled order',
      clientName:
  user?.role === 'SPECIALIST'
          ? order?.customer?.user?.name || 'Client'
          : order?.specialist?.user?.name || 'No specialist assigned',
      clientAvatar:
  user?.role === 'SPECIALIST'
          ? order?.customer?.user?.avatar || '/api/placeholder/60/60'
          : order?.specialist?.user?.avatar || '/api/placeholder/60/60',
      location: order?.location || 'Location not specified',
      deadline: order?.createdAt
        ? `To be completed by ${new Date(
            order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000
          ).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
        : 'No deadline',
      status: mapOrderStatus(order?.status ?? 'OPEN', type),
      statusText: getStatusText(
        order?.status ?? 'OPEN',
        type,
        (user?.role as 'SPECIALIST' | 'CUSTOMER') || 'CUSTOMER'
      ),
    }))

    console.log('API: Formatted orders for frontend:', formattedOrders.length, 'orders')
    if (process.env.NODE_ENV === 'development') {
      console.log('API: Order details:', formattedOrders.map(o => ({
        id: o.id,
        title: o.title,
        clientName: o.clientName,
        status: o.status,
        statusText: o.statusText
      })))
    }

    return NextResponse.json({
      orders: formattedOrders,
      total: formattedOrders.length
    })

  } catch (error) {
    console.error('Error fetching orders:', error)

    // If the database is unreachable (e.g., Prisma P1001), don't break the dashboard
    const errAny: any = error
    const msg: string = errAny?.message || ''
    const code: string | undefined = errAny?.code
    if (code === 'P1001' || msg.includes("Can't reach database server")) {
      console.warn('DB unavailable (P1001). Returning empty orders as a graceful fallback.')
      return NextResponse.json({ orders: [], total: 0, warning: 'db_unavailable' })
    }

    const body: any = { error: 'Internal server error' }
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
      body.details = error.message
      body.stack = error.stack
    }
    return NextResponse.json(body, { status: 500 })
  }
}

function mapOrderStatus(dbStatus: string, type: string) {
  switch (dbStatus) {
    case 'OPEN':
      return type === 'suggestions' ? 'suggested' : 'waiting'
    case 'IN_PROGRESS':
      return 'in-progress'
    case 'COMPLETED':
      return 'completed'
    case 'CANCELLED':
      return 'cancelled'
    default:
      return 'waiting'
  }
}

function getStatusText(dbStatus: string, type: string, userRole: 'SPECIALIST' | 'CUSTOMER') {
  if (userRole === 'SPECIALIST') {
    switch (dbStatus) {
      case 'OPEN':
        return type === 'suggestions' ? 'You responded to this order' : 'Waiting for a specialist'
      case 'IN_PROGRESS':
        return 'In progress'
      case 'COMPLETED':
        return 'Completed'
      case 'CANCELLED':
        return 'Cancelled'
      default:
        return 'Unknown status'
    }
  } else { // CUSTOMER
    switch (dbStatus) {
      case 'OPEN':
        if (type === 'suggestions') {
          return 'Received responses'
        }
        return 'Looking for specialist'
      case 'IN_PROGRESS':
        return 'Specialist is working'
      case 'COMPLETED':
        return 'Work completed'
      case 'CANCELLED':
        return 'Order cancelled'
      default:
        return 'Unknown status'
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/orders - Starting request')
    const authResult = await auth()
    console.log('Auth result:', authResult)
    const { userId } = authResult
    
    if (!userId) {
      console.log('No userId found in auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Authenticated user ID:', userId)

    // First, ensure user exists in our database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      // Get user info from Clerk
      const { createClerkClient } = await import('@clerk/nextjs/server')
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY!,
      })
      const clerkUser = await clerkClient.users.getUser(userId)
      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress

      if (!primaryEmail) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 400 }
        )
      }

      // Create user with CUSTOMER role by default for orders
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: primaryEmail,
          name: clerkUser.firstName || clerkUser.username || null,
          role: 'CUSTOMER'
        }
      })
    }

    // Parse request body - handle both JSON and FormData
    let requestData: any = {}
    const contentType = req.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      requestData = await req.json()
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData()
      
      // Convert FormData to object
      requestData = {}
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('file_')) {
          // Handle files separately if needed
          continue
        }
        requestData[key] = value
      }
      
      // Map form field names to expected API field names
      requestData.title = requestData.task || requestData.title
      requestData.description = requestData.description
      requestData.confidentialData = requestData.confidentialData
      
      // Find category by name if needed
      if (requestData.category && !requestData.categoryId) {
        const categoryRecord = await prisma.category.findFirst({
          where: { 
            OR: [
              { name: { contains: requestData.category, mode: 'insensitive' } },
              { slug: requestData.category }
            ]
          }
        })
        if (categoryRecord) {
          requestData.categoryId = categoryRecord.id
        }
      }
    }

    const {
      title,
      description,
      confidentialData,
      specialistId,
      categoryId,
      location,
      workLocation,
      workType,
      timePreference,
      selectedDate,
      selectedDay,
      contactName,
      contactEmail,
      contactPhone
    } = requestData

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Find or create category (default if not provided)
    let categoryRecord = await prisma.category.findFirst({
      where: categoryId ? { id: categoryId } : { slug: 'general' }
    })

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: 'General',
          slug: 'general'
        }
      })
    }

    // Find or create customer record
    let customer = await prisma.customer.findUnique({
      where: { userId: user.id }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId: user.id,
          isActive: true
        }
      })
    }

    // Validate specialist exists if provided
    let specialist = null
    if (specialistId) {
      specialist = await prisma.pro.findUnique({
        where: { id: specialistId },
        include: { user: true }
      })
      
      if (!specialist) {
        return NextResponse.json(
          { error: 'Specialist not found' },
          { status: 404 }
        )
      }
    }

    // Create order description with all details
    const fullDescription = [
      description,
      confidentialData ? `\n\nConfidential data: ${confidentialData}` : '',
      workLocation ? `\nWork location: ${workLocation}` : '',
      workType ? `\nWork type: ${workType}` : '',
      timePreference ? `\nTime preference: ${timePreference}` : '',
      contactName ? `\nContact: ${contactName}` : '',
      contactEmail ? `\nEmail: ${contactEmail}` : '',
      contactPhone ? `\nPhone: ${contactPhone}` : ''
    ].filter(Boolean).join('')

    // Create order in database. If specialistId is provided, we create a targeted invitation
    // rather than assigning the specialist immediately, so the order shows up in the
    // specialist's "suggestions" list (OPEN + responses.some + specialistId == null)
    const order = await prisma.order.create({
      data: {
        title,
        description: fullDescription,
        location: location || '',
        categoryId: categoryRecord.id,
        customerId: customer.id,
        specialistId: null, // keep unassigned; use OrderResponse to target specialist
        status: 'OPEN'
      },
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
      }
    })

    // If a specialist was targeted, create an invitation response entry
    if (specialistId) {
      try {
        await prisma.orderResponse.create({
          data: {
            orderId: order.id,
            specialistId: specialistId as string,
            message: 'Direct customer offer',
          },
        })
      } catch (e) {
        console.warn('Failed to create invitation response for specialist', specialistId, e)
      }
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        title: order.title,
        description: order.description,
        category: order.category.name,
        status: order.status,
        createdAt: order.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
