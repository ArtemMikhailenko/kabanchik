import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        pro: {
          include: {
            profile: true
          }
        },
        customer: true
      }
    })

    console.log('👥 Users in database:')
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email})`)
      console.log(`  Clerk ID: ${user.clerkId}`)
      console.log(`  Role: ${user.role}`)
      if (user.pro) console.log(`  Is specialist: ✅`)
      if (user.customer) console.log(`  Is customer: ✅`)
      console.log('')
    })

    const orders = await prisma.order.findMany({
      include: {
        customer: {
          include: { user: true }
        },
        specialist: {
          include: { user: true }
        },
        responses: true
      }
    })

    console.log('📋 Orders in database:')
    orders.forEach(order => {
      console.log(`- ${order.title}`)
      console.log(`  Status: ${order.status}`)
      console.log(`  Customer: ${order.customer.user.name}`)
      if (order.specialist) console.log(`  Specialist: ${order.specialist.user.name}`)
      console.log(`  Responses: ${order.responses.length}`)
      console.log('')
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
