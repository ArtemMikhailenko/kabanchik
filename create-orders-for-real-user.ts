import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createOrdersForRealUser() {
  try {
    // Находим реального пользователя
    const realUser = await prisma.user.findUnique({
      where: { clerkId: 'user_32aciSftLNr1B0Jke7JgsRUpt0f' },
      include: {
        pro: true,
        customer: true
      }
    })

    if (!realUser) {
      console.log('Real user not found')
      return
    }

    console.log('Found real user:', realUser.email)

    // Найдем тестового заказчика
    const testCustomer = await prisma.customer.findFirst({
      include: { user: true }
    })

    if (!testCustomer) {
      console.log('No test customer found')
      return
    }

    // Найдем категорию
    const category = await prisma.category.findFirst()
    if (!category) {
      console.log('No category found')
      return
    }

    // Создаем заказ где реальный пользователь-специалист откликнулся (для suggestions)
    const orderForSuggestions = await prisma.order.create({
      data: {
        title: 'Ремонт холодильника LG',
        description: 'Холодильник перестал морозить. Нужна диагностика и ремонт.',
        location: 'Киев, ул. Хрещатик 20',
        customerId: testCustomer.id,
        categoryId: category.id,
        status: 'OPEN'
      }
    })

    // Создаем отклик реального специалиста
    if (realUser.pro) {
      await prisma.orderResponse.create({
        data: {
          orderId: orderForSuggestions.id,
          specialistId: realUser.pro.id,
          message: 'Готов выполнить ремонт холодильника. Опыт работы с техникой LG.'
        }
      })
      console.log('✅ Created suggestion order with response')
    }

    // Создаем заказ в работе у реального специалиста (для at-work)
    const orderAtWork = await prisma.order.create({
      data: {
        title: 'Установка встроенной посудомоечной машины',
        description: 'Установка и подключение посудомоечной машины Bosch в кухонный гарнитур.',
        location: 'Киев, пр. Науки 45',
        customerId: testCustomer.id,
        categoryId: category.id,
        specialistId: realUser.pro?.id,
        status: 'IN_PROGRESS'
      }
    })

    console.log('✅ Created at-work order')

    // Создаем еще один заказ для suggestions
    const anotherSuggestion = await prisma.order.create({
      data: {
        title: 'Замена крана на кухне',
        description: 'Старый кран протекает, нужно заменить на новый. Кран уже куплен.',
        location: 'Киев, ул. Саксаганского 10',
        customerId: testCustomer.id,
        categoryId: category.id,
        status: 'OPEN'
      }
    })

    // Отклик на второй заказ
    if (realUser.pro) {
      await prisma.orderResponse.create({
        data: {
          orderId: anotherSuggestion.id,
          specialistId: realUser.pro.id,
          message: 'Могу заменить кран. Работаю с сантехникой 7 лет.'
        }
      })
      console.log('✅ Created another suggestion order')
    }

    console.log('\n📊 Orders created for real user!')
    console.log(`User Clerk ID: ${realUser.clerkId}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createOrdersForRealUser()
