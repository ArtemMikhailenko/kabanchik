import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categorySlug: string }> }
) {
  try {
    const { categorySlug } = await params

    // Find the category by slug
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Get services from the hierarchical API for this category
    const hierarchicalResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/categories/hierarchical`)
    if (!hierarchicalResponse.ok) {
      throw new Error('Failed to fetch hierarchical categories')
    }
    
    const hierarchicalData = await hierarchicalResponse.json()
    const categoryData = hierarchicalData.categories?.find((cat: any) => cat.slug === categorySlug)
    
    if (!categoryData || !categoryData.services) {
      return NextResponse.json({
        parentCategory: {
          id: category.id,
          name: category.name,
          slug: category.slug
        },
        popularServices: []
      })
    }

    // For each service, count orders that mention this service
    const popularServices = await Promise.all(
      categoryData.services.slice(0, 8).map(async (serviceName: string, index: number) => {
        // Count orders that have this service name in description or title
        const orderCount = await prisma.order.count({
          where: {
            OR: [
              { title: { contains: serviceName, mode: 'insensitive' } },
              { description: { contains: serviceName, mode: 'insensitive' } }
            ]
          }
        })

        return {
          id: `${category.id}-${index}`,
          name: serviceName,
          slug: serviceName.toLowerCase().replace(/\s+/g, '-'),
          orderCount,
          iconColor: categoryData.iconColor || '#55c4c8'
        }
      })
    )

    // Sort by order count (descending)
    const sortedServices = popularServices.sort((a, b) => b.orderCount - a.orderCount)

    return NextResponse.json({
      parentCategory: {
        id: category.id,
        name: category.name,
        slug: category.slug
      },
      popularServices: sortedServices
    })

  } catch (error) {
    console.error('Error fetching popular services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular services' },
      { status: 500 }
    )
  }
}