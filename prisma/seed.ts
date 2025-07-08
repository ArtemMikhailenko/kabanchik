import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем заполнение базы данных...')

  // Создаем тестовые данные
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Тестовый пользователь',
      clerkId: 'test-user-1',
    },
  })

  console.log('База данных заполнена!', { user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
