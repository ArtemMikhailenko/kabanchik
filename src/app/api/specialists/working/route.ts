import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { customer: true }
    })

    if (!user?.customer) {
      return NextResponse.json({ specialists: [] })
    }

    // Получаем все заказы кастомера со статусом IN_PROGRESS
    const ordersInProgress = await prisma.order.findMany({
      where: {
        customerId: user.customer.id,
        status: 'IN_PROGRESS',
        specialistId: { not: null }
      },
      include: {
        specialist: {
          include: {
            user: true,
            profile: true
          }
        },
        category: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Формируем список уникальных специалистов с информацией о заказах
    const specialistsMap = new Map()

    ordersInProgress.forEach((order: any) => {
      if (order.specialist) {
        const specialistId = order.specialist.id
        
        if (!specialistsMap.has(specialistId)) {
          specialistsMap.set(specialistId, {
            id: order.specialist.id,
            userId: order.specialist.userId,
            name: order.specialist.user.name || 'Unknown',
            avatar: order.specialist.user.avatar || '/photo.png',
            bio: order.specialist.user.bio,
            rating: order.specialist.profile?.rating ? Number(order.specialist.profile.rating) : 0,
            reviewCount: order.specialist.profile?.reviewCount || 0,
            categories: order.specialist.profile?.categories || [],
            orders: []
          })
        }

        // Добавляем информацию о заказе
        specialistsMap.get(specialistId).orders.push({
          id: order.id,
          title: order.title,
          categoryName: order.category.name,
          budget: order.budget ? Number(order.budget) : null,
          createdAt: order.createdAt
        })
      }
    })

    const specialists = Array.from(specialistsMap.values())

    return NextResponse.json({ specialists })
  } catch (error) {
    console.error('Error fetching working specialists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch specialists', warning: 'db_unavailable' },
      { status: 500 }
    )
  }
}
