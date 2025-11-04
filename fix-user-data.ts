import prisma from './src/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'

async function fixUserData() {
  try {
    console.log('Starting to fix user data...')
    
    // Находим всех пользователей с проблемными именами или аватарами
    const problematicUsers = await prisma.user.findMany({
      where: {
        OR: [
          { name: 'Unknown' },
          { name: 'null' },
          { name: null },
          { avatar: 'null' }
        ]
      }
    })

    console.log(`Found ${problematicUsers.length} users to fix`)

    const clerk = await clerkClient()

    for (const user of problematicUsers) {
      try {
        console.log(`\nFixing user: ${user.email} (ID: ${user.id})`)
        console.log(`  Current name: "${user.name}"`)
        console.log(`  Current avatar: "${user.avatar}"`)
        
        // Получаем данные из Clerk
        let clerkUser = null
        try {
          clerkUser = await clerk.users.getUser(user.clerkId)
        } catch (error) {
          console.log(`  - Clerk user not found for ${user.email}`)
          continue
        }

        // Определяем лучшее имя
        let newName = user.name
        if (user.name === 'Unknown' || user.name === 'null' || !user.name) {
          if (clerkUser.fullName) {
            newName = clerkUser.fullName
          } else if (clerkUser.firstName && clerkUser.lastName) {
            newName = `${clerkUser.firstName} ${clerkUser.lastName}`
          } else if (clerkUser.firstName) {
            newName = clerkUser.firstName
          } else if (clerkUser.lastName) {
            newName = clerkUser.lastName
          } else {
            // Если нет имени в Clerk, используем email
            newName = user.email || 'User'
          }
        }

        // Исправляем аватар
        let newAvatar = user.avatar
        if (user.avatar === 'null') {
          newAvatar = clerkUser.imageUrl || null
        }

        // Обновляем пользователя
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: newName,
            avatar: newAvatar
          }
        })
        
        console.log(`  - Updated name to: "${updatedUser.name}"`)
        console.log(`  - Updated avatar to: "${updatedUser.avatar}"`)
        
      } catch (error) {
        console.error(`  - Error processing user ${user.email}:`, error)
      }
    }

    console.log('\nData fix completed!')

  } catch (error) {
    console.error('Error fixing user data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixUserData()