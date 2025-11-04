import prisma from './src/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'

async function updateUnknownUsers() {
  try {
    console.log('Starting to update users with "Unknown" names...')
    
    // Находим всех пользователей с именем "Unknown"
    const unknownUsers = await prisma.user.findMany({
      where: {
        name: 'Unknown'
      }
    })

    console.log(`Found ${unknownUsers.length} users with "Unknown" names`)

    if (unknownUsers.length === 0) {
      console.log('No users with "Unknown" names found. Exiting.')
      return
    }

    const clerk = await clerkClient()
    let updatedCount = 0

    for (const user of unknownUsers) {
      try {
        console.log(`Processing user: ${user.email} (ID: ${user.id})`)
        
        // Получаем данные из Clerk
        const clerkUser = await clerk.users.getUser(user.clerkId)
        
        if (!clerkUser) {
          console.log(`  - Clerk user not found for ${user.email}`)
          continue
        }

        // Определяем лучшее имя
        let newName = user.name
        const userEmail = clerkUser.emailAddresses[0]?.emailAddress || user.email
        
        if (clerkUser.fullName) {
          newName = clerkUser.fullName
        } else if (clerkUser.firstName && clerkUser.lastName) {
          newName = `${clerkUser.firstName} ${clerkUser.lastName}`
        } else if (clerkUser.firstName) {
          newName = clerkUser.firstName
        } else if (clerkUser.lastName) {
          newName = clerkUser.lastName
        } else if (userEmail) {
          newName = userEmail
        }

        if (newName !== 'Unknown') {
          // Обновляем пользователя
          await prisma.user.update({
            where: { id: user.id },
            data: {
              name: newName,
              email: userEmail
            }
          })
          
          console.log(`  - Updated name from "Unknown" to "${newName}"`)
          updatedCount++
        } else {
          console.log(`  - No better name found for ${user.email}`)
        }
        
      } catch (error) {
        console.error(`  - Error processing user ${user.email}:`, error)
      }
    }

    console.log(`\nCompleted! Updated ${updatedCount} out of ${unknownUsers.length} users.`)

  } catch (error) {
    console.error('Error updating unknown users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем скрипт
updateUnknownUsers()