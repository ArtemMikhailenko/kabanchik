// src/app/api/orders/by-category/[categoryId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: {
    categoryId: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { categoryId } = params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Get the main category
    const mainCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!mainCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Get all categories (this main category + all related subcategories based on slug pattern)
    const allCategories = await prisma.category.findMany({
      where: {
        isActive: true,
        OR: [
          { id: categoryId }, // The main category itself
          { slug: { startsWith: mainCategory.slug + '-' } } // All subcategories with related slugs
        ]
      },
      select: { id: true }
    })

    const categoryIds = allCategories.map(cat => cat.id)

    // Get orders for the category and all its related subcategories
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          categoryId: {
            in: categoryIds
          },
          status: {
            in: ['OPEN', 'IN_PROGRESS', 'COMPLETED']
          }
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          customer: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          specialist: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          _count: {
            select: {
              responses: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({
        where: {
          categoryId: {
            in: categoryIds
          },
          status: {
            in: ['OPEN', 'IN_PROGRESS', 'COMPLETED']
          }
        }
      })
    ])

    // Format the orders to match the expected structure
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      title: order.title,
      description: order.description,
      budget: order.budget ? Number(order.budget) : null,
      location: order.location,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      category: order.category,
      customer: {
        id: order.customer.id,
        user: order.customer.user
      },
      specialist: order.specialist ? {
        id: order.specialist.id,
        user: order.specialist.user
      } : null,
      responsesCount: order._count.responses
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching orders by category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}