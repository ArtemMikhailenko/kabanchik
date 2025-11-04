import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestOrders() {
  try {
    // Находим первого специалиста
    const specialist = await prisma.pro.findFirst({
      include: { user: true }
    })

    // Находим первого заказчика
    const customer = await prisma.customer.findFirst({
      include: { user: true }
    })

    // Находим категорию
    const category = await prisma.category.findFirst({
      where: { parentId: { not: null } } // берем подкатегорию
    })

    if (!specialist || !customer || !category) {
      console.log('Need specialist, customer and category in database')
      return
    }

    console.log('Found specialist:', specialist.user.name)
    console.log('Found customer:', customer.user.name)
    console.log('Found category:', category.name)

    // Создаем заказ в статусе OPEN (для suggestions)
    const openOrder = await prisma.order.create({
      data: {
        title: 'Установка кондиционера в квартире',
        description: 'Нужно установить кондиционер в спальне. Квартира на 5 этаже. Все материалы есть.',
        location: 'Киев, ул. Крещатик 10',
        customerId: customer.id,
        categoryId: category.id,
        status: 'OPEN'
      }
    })

    // Создаем отклик специалиста на этот заказ
    await prisma.orderResponse.create({
      data: {
        orderId: openOrder.id,
        specialistId: specialist.id,
        message: 'Готов выполнить установку кондиционера. Опыт работы 5 лет.'
      }
    })

    // Создаем заказ в работе
    const inProgressOrder = await prisma.order.create({
      data: {
        title: 'Ремонт стиральной машины Samsung',
        description: 'Стиральная машина не отжимает белье. Нужна диагностика и ремонт.',
        location: 'Киев, пр. Победы 50',
        customerId: customer.id,
        categoryId: category.id,
        specialistId: specialist.id,
        status: 'IN_PROGRESS'
      }
    })

    // Создаем завершенный заказ
    const completedOrder = await prisma.order.create({
      data: {
        title: 'Монтаж полок в гостиной',
        description: 'Установка 3х настенных полок из IKEA. Стена бетонная.',
        location: 'Киев, ул. Льва Толстого 15',
        customerId: customer.id,
        categoryId: category.id,
        specialistId: specialist.id,
        status: 'COMPLETED'
      }
    })

    console.log('✅ Created test orders:')
    console.log('- Open order (for suggestions):', openOrder.id)
    console.log('- In progress order (for at-work):', inProgressOrder.id) 
    console.log('- Completed order:', completedOrder.id)

  } catch (error) {
    console.error('Error creating test orders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestOrders()
