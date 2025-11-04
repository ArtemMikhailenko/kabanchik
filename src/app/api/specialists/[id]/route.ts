import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: specialistId } = params || ({} as any)

    if (!specialistId || typeof specialistId !== 'string') {
      return NextResponse.json(
        { error: 'Specialist id is required' },
        { status: 400 }
      )
    }

    // Получаем специалиста из базы данных
    const pro = await prisma.pro.findUnique({
      where: { id: specialistId },
      include: {
        user: {
          include: {
            portfolioItems: true
          }
        },
        profile: true
      }
    })

    if (!pro) {
      return NextResponse.json(
        { error: 'Specialist not found' },
        { status: 404 }
      )
    }

    // Получаем количество завершенных заказов
    const completedOrdersCount = await prisma.order.count({
      where: {
        specialistId: pro.id,
        status: 'COMPLETED'
      }
    })

    // Получаем отзывы специалиста
    const reviews = await prisma.review.findMany({
      where: {
        specialistId: pro.userId
      },
      include: {
        reviewer: true,
        order: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get the main category information for popular services
    let mainCategory: { id: string; name: string; slug: string } | null = null
    try {
      if (Array.isArray(pro.profile?.categories) && pro.profile!.categories.length > 0) {
        for (const categoryIdOrName of pro.profile!.categories) {
          let category = null as any
          
          // First try to find by ID (if it looks like a CUID)
          if (typeof categoryIdOrName === 'string' && categoryIdOrName.length > 20) {
            category = await prisma.category.findUnique({
              where: { id: categoryIdOrName }
            })
          }
          
          // If not found by ID, try by name (case-insensitive)
          if (!category && typeof categoryIdOrName === 'string') {
            category = await prisma.category.findFirst({
              where: { name: { equals: categoryIdOrName, mode: 'insensitive' } }
            })
          }
          
          if (category) {
            // If it's a subcategory, get the parent; otherwise use itself
            if (category.parentId) {
              const parentCategory = await prisma.category.findUnique({
                where: { id: category.parentId }
              })
              if (parentCategory) {
                mainCategory = { id: parentCategory.id, name: parentCategory.name, slug: parentCategory.slug }
              }
            } else {
              mainCategory = { id: category.id, name: category.name, slug: category.slug }
            }
            break
          }
        }
      }
    } catch (e) {
      console.warn('Specialist mainCategory resolution failed:', e)
    }

    // Форматируем данные для фронтенда
    const formattedSpecialist = {
      id: pro.id,
      name: pro.user.name || 'Unknown',
      photo: pro.user.avatar || '/placeholder-avatar.jpg',
      city: 'Not specified', // Поле city отсутствует в профиле
      rating: parseFloat(pro.profile?.rating?.toString() || '0'),
      reviewCount: pro.profile?.reviewCount || 0,
      positivePercentage: pro.profile?.reviewCount ? Math.round(parseFloat(pro.profile?.rating?.toString() || '0') * 20) : 0,
      completedOrders: completedOrdersCount,
      description: pro.user.bio || pro.profile?.bio || 'No description provided.',
      isOnline: pro.isActive,
      lastSeen: pro.isActive ? 'Online now' : 'Offline',
      
      // Сервисы из категорий профиля
      services: pro.profile?.categories?.map((category, index) => ({
        id: (index + 1).toString(),
        title: category,
        description: `Профессиональные услуги по направлению ${category}. Высокое качество выполнения работ и индивидуальный подход к каждому клиенту.`,
        icon: '🔧'
      })) || [],
      
      // Отзывы из базы данных
      reviews: reviews.map(review => ({
        id: review.id,
        customerName: review.reviewer.name || 'Anonymous',
        customerPhoto: review.reviewer.avatar || '/placeholder-avatar.jpg',
        date: review.createdAt.toISOString(),
        rating: review.rating,
        text: review.comment || '',
        serviceTitle: 'Service', // можно добавить позже из заказа
        qualityOfWork: review.rating,
        courtesy: review.rating,
        punctuality: review.rating
      })),
      
      // Портфолио из базы данных
      portfolioItems: pro.user.portfolioItems?.map((item) => ({
        id: item.id,
        images: item.image ? [item.image] : [],
        tags: item.tags || []
      })) || [],

      // Main category for popular services
      mainCategory
    }

    return NextResponse.json(formattedSpecialist)

  } catch (error) {
    console.error('Error fetching specialist:', error)
    const errAny: any = error
    const msg: string = errAny?.message || ''
    const code: string | undefined = errAny?.code
    if (code === 'P1001' || msg.includes("Can't reach database server")) {
      console.warn('DB unavailable (P1001) during specialist fetch. Returning minimal fallback.')
      // Try to return a minimal object to keep page functional
      return NextResponse.json({
        id: params?.id || 'unknown',
        name: 'Specialist',
        photo: '/photo.png',
        city: 'Not specified',
        rating: 0,
        reviewCount: 0,
        positivePercentage: 0,
        completedOrders: 0,
        description: 'Profile data is temporarily unavailable.',
        isOnline: false,
        lastSeen: 'Unknown',
        services: [],
        reviews: [],
        portfolioItems: [],
        mainCategory: null,
        warning: 'db_unavailable'
      })
    }
    return NextResponse.json(
      { error: 'Failed to fetch specialist' },
      { status: 500 }
    )
  }
}
