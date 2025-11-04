import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get all categories
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

    // Define main category patterns
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

    // Define color palette for categories
    const colors = [
      '#34979a', '#ffa657', '#ffeb3b', '#9c27b0', '#e91e63', '#2196f3', 
      '#4caf50', '#ff5722', '#795548', '#607d8b', '#3f51b5', '#00bcd4',
      '#8bc34a', '#cddc39', '#ffc107', '#ff9800', '#f44336', '#673ab7',
      '#009688', '#03a9f4'
    ]

    // Get main categories and their subcategories
    const mainCategories = allCategories.filter(category => 
      mainCategoryPatterns.includes(category.slug)
    );

    // Build hierarchical structure
    const hierarchicalCategories = mainCategories.map((mainCategory, index) => {
      // Find subcategories for this main category
      const subcategories = allCategories.filter(cat => 
        cat.slug !== mainCategory.slug && 
        cat.slug.startsWith(mainCategory.slug + '-')
      );

      // Transform subcategories to service names
      const services = subcategories.map(sub => sub.name);

      return {
        id: mainCategory.id,
        title: mainCategory.name,
        slug: mainCategory.slug,
        services: services,
        iconColor: colors[index % colors.length],
        description: mainCategory.description,
        orderCount: mainCategory._count.orders || 0
      };
    });

    return NextResponse.json({ categories: hierarchicalCategories })
  } catch (error) {
    console.error('Error fetching hierarchical categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: String(error) },
      { status: 500 }
    )
  }
}