// src/app/api/categories/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Based on the slug patterns, let's identify main categories by filtering out detailed subcategories
    // Main categories typically have shorter, general slugs
    const allCategories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        subcategories: {
          where: { isActive: true },
          select: { id: true }
        },
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

    // Filter to get main categories based on slug patterns
    // Main categories should have simple slugs without hyphens for specific services
    const mainCategoryPatterns = [
      'home-services',
      'tech-repair', 
      'finishing-works',
      'construction-works',
      'furniture-services',
      'cleaning-services',
      'transport-storage',
      'household-services',
      'auto-repair',
      'travel',
      'courier-services',
      'digital-marketing',
      'ai-services',
      'other-online-advertising',
      'advertising-distribution',
      'business-services',
      'pet-services',
      'beauty-health',
      'event-organization',
      'translation-services',
      'tutoring',
      'web-app-development',
      'online-work',
      'photo-video-services',
      'culinary',
      'training-services',
      'design',
      'alternative-specialists',
      'psychological-support',
      'medical-services',
      'education',
      'security'
    ];

    const mainCategories = allCategories.filter(category => 
      mainCategoryPatterns.includes(category.slug)
    );

    // For each main category, count orders from all related categories
    const categoriesWithOrderCounts = await Promise.all(
      mainCategories.map(async (category) => {
        try {
          // Find all related categories (same base slug pattern)
          const baseSlug = category.slug;
          const relatedCategories = allCategories.filter(cat => 
            cat.slug === baseSlug || cat.slug.startsWith(baseSlug + '-')
          );
          
          const categoryIds = relatedCategories.map(cat => cat.id);
          
          // Count orders in this category and all its related subcategories
          const orderCount = await prisma.order.count({
            where: {
              categoryId: {
                in: categoryIds
              },
              status: {
                in: ['OPEN', 'IN_PROGRESS', 'COMPLETED'] // All visible orders
              }
            }
          })

          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            iconColor: category.iconColor,
            ordersCount: orderCount
          }
        } catch (categoryError) {
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            iconColor: category.iconColor,
            ordersCount: 0
          }
        }
      })
    )

    return NextResponse.json(categoriesWithOrderCounts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}