import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get all categories with order counts
    const allCategories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    // Define color palette for categories
    const colors = [
      '#34979a', '#ffa657', '#ffeb3b', '#9c27b0', '#e91e63', '#2196f3', 
      '#4caf50', '#ff5722', '#795548', '#607d8b', '#3f51b5', '#00bcd4',
      '#8bc34a', '#cddc39', '#ffc107', '#ff9800', '#f44336', '#673ab7',
      '#009688', '#03a9f4'
    ]

    // Transform to match the frontend interface
    const transformedCategories = allCategories.map((category: any, index: number) => ({
      id: category.id,
      title: category.name,
      slug: category.slug,
      services: [], // Empty services for now
      iconColor: colors[index % colors.length],
      description: category.description,
      orderCount: category._count.orders || 0
    }))

    return NextResponse.json({ categories: transformedCategories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: String(error) },
      { status: 500 }
    )
  }
}
