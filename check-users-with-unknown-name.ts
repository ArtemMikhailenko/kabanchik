import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsersWithUnknownName() {
  try {
    console.log('Checking users with "Unknown" name...')
    
    const usersWithUnknownName = await prisma.user.findMany({
      where: {
        name: 'Unknown'
      },
      select: {
        id: true,
        clerkId: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    console.log(`Found ${usersWithUnknownName.length} users with "Unknown" name:`)
    usersWithUnknownName.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, Clerk ID: ${user.clerkId}, Email: ${user.email}, Role: ${user.role}`)
    })

    // Также проверим всех пользователей
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        name: true,
        email: true,
        role: true
      }
    })

    console.log('\nAll users in database:')
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Name: "${user.name}", Email: ${user.email}, Role: ${user.role}`)
    })

  } catch (error) {
    console.error('Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsersWithUnknownName()