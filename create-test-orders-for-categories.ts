// Скрипт для создания тестовых заказов в различных категориях
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestOrders() {
  try {
    console.log('Создание тестовых заказов...')

    // Получаем все категории
    const categories = await prisma.category.findMany({
      where: { isActive: true }
    })

    console.log(`Найдено ${categories.length} категорий`)

    // Создаем тестовые заказы для каждой категории
    for (const category of categories) {
      const orderCount = Math.floor(Math.random() * 10) + 1 // От 1 до 10 заказов на категорию
      
      for (let i = 0; i < orderCount; i++) {
        await prisma.order.create({
          data: {
            title: `Test order ${i + 1} for ${category.name}`,
            description: `This is a test order for category ${category.name}. Lorem ipsum dolor sit amet consectetur.`,
            budget: Math.floor(Math.random() * 1000) + 100,
            location: ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv'][Math.floor(Math.random() * 5)],
            categoryId: category.id,
            customerId: 'temp-customer-id', // Временный ID
            status: ['OPEN', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 3)] as any
          }
        })
      }
      
      console.log(`Создано ${orderCount} заказов для категории: ${category.name}`)
    }

    console.log('Тестовые заказы созданы успешно!')
    
    // Показываем статистику
    const totalOrders = await prisma.order.count()
    console.log(`Общее количество заказов в базе: ${totalOrders}`)

  } catch (error) {
    console.error('Ошибка создания тестовых заказов:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestOrders()