import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestData() {
  try {
    // Проверяем есть ли категория
    let category = await prisma.category.findFirst()

    if (!category) {
      // Создаем категорию если нет
      category = await prisma.category.create({
        data: {
          name: 'Установка кондиционеров',
          slug: 'air-conditioning-installation'
        }
      })
      console.log('✅ Created category:', category.name)
    }

    // Создаем пользователя-специалиста
    const specialistUser = await prisma.user.create({
      data: {
        clerkId: 'test_specialist_' + Math.random(),
        email: 'specialist@test.com',
        name: 'Иван Петров',
        avatar: '/photo.png',
        role: 'SPECIALIST'
      }
    })

    const specialist = await prisma.pro.create({
      data: {
        userId: specialistUser.id
      }
    })

    // Создаем профиль специалиста
    await prisma.specialistProfile.create({
      data: {
        proId: specialist.id,
        bio: 'Опытный мастер по установке кондиционеров',
        rating: 4.8,
        skills: ['Установка кондиционеров', 'Ремонт техники'],
        categories: [category.id]
      }
    })

    console.log('✅ Created specialist:', specialistUser.name)

    // Создаем пользователя-заказчика
    const customerUser = await prisma.user.create({
      data: {
        clerkId: 'test_customer_' + Math.random(),
        email: 'customer@test.com',
        name: 'Анна Сидорова',
        avatar: '/photo.png',
        role: 'CUSTOMER'
      }
    })

    const customer = await prisma.customer.create({
      data: {
        userId: customerUser.id
      }
    })

    console.log('✅ Created customer:', customerUser.name)

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

    console.log('✅ Created open order with response:', openOrder.title)

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

    console.log('✅ Created in-progress order:', inProgressOrder.title)

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

    console.log('✅ Created completed order:', completedOrder.title)

    console.log('\n📊 Test data created successfully!')
    console.log(`Specialist User ID: ${specialistUser.clerkId}`)
    console.log(`Customer User ID: ${customerUser.clerkId}`)

  } catch (error) {
    console.error('Error creating test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestData()
