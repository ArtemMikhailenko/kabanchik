import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, action } = body

    if (!orderId || !action) {
      return NextResponse.json({ error: 'Missing orderId or action' }, { status: 400 })
    }

    // Найдем пользователя
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        pro: true
      }
    })

    if (!user || !user.pro) {
      return NextResponse.json({ error: 'Specialist profile not found' }, { status: 404 })
    }

    // Найдем заказ
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        responses: {
          where: {
            specialistId: user.pro.id
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Для действий accept/decline проверяем, что специалист откликнулся
    if (action !== 'offer') {
      const response = order.responses.find(r => r.specialistId === user.pro!.id)
      if (!response) {
        return NextResponse.json({ error: 'You have not responded to this order' }, { status: 403 })
      }
    }

    switch (action) {
      case 'offer':
        // Предложить услуги - создать отклик
        const existingResponse = await prisma.orderResponse.findUnique({
          where: {
            orderId_specialistId: {
              orderId: orderId,
              specialistId: user.pro.id
            }
          }
        })

        if (existingResponse) {
          return NextResponse.json({ 
            message: 'You have already responded to this order',
            orderId
          }, { status: 400 })
        }

        await prisma.orderResponse.create({
          data: {
            orderId: orderId,
            specialistId: user.pro.id,
            message: 'Готов выполнить ваш заказ. Обращайтесь!'
          }
        })
        
        return NextResponse.json({ 
          message: 'Service offered successfully',
          orderId
        })

      case 'accept':
        // Принять заказ - назначить специалиста и изменить статус
        console.log('Accepting order:', orderId, 'for specialist:', user.pro.id)
        
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            specialistId: user.pro.id,
            status: 'IN_PROGRESS'
          }
        })
        
        console.log('Order updated successfully:', updatedOrder)
        
        return NextResponse.json({ 
          message: 'Order accepted successfully',
          orderId,
          newStatus: 'IN_PROGRESS'
        })

      case 'decline':
        // Отклонить заказ - удалить отклик специалиста
        await prisma.orderResponse.delete({
          where: {
            orderId_specialistId: {
              orderId: orderId,
              specialistId: user.pro.id
            }
          }
        })
        
        return NextResponse.json({ 
          message: 'Order declined successfully',
          orderId
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error processing order action:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
