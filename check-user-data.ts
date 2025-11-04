import prisma from './src/lib/prisma'

async function checkUserData() {
  try {
    console.log('Checking user data in database...')
    
    // Находим всех пользователей
    const users = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Found ${users.length} users:`)
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.id}`)
      console.log(`   Clerk ID: ${user.clerkId}`)
      console.log(`   Name: "${user.name}"`)
      console.log(`   Email: "${user.email}"`)
      console.log(`   Avatar: "${user.avatar}"`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Created: ${user.createdAt}`)
    })

    // Проверим пользователей с именем "Unknown"
    const unknownUsers = await prisma.user.findMany({
      where: {
        name: 'Unknown'
      }
    })

    console.log(`\nFound ${unknownUsers.length} users with "Unknown" names`)

  } catch (error) {
    console.error('Error checking user data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserData()