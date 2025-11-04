import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testModels() {
  try {
    console.log('Available models:', Object.keys(prisma))
    
    // Попробуем найти модель специалиста
    const testUser = await prisma.user.findFirst()
    console.log('First user:', testUser)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testModels()
