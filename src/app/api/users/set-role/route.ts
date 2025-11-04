import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { role } = body

    if (!role || !['CUSTOMER', 'SPECIALIST'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be CUSTOMER or SPECIALIST' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { role }
    })

    // Create corresponding profile if doesn't exist
    if (role === 'CUSTOMER') {
      const existingCustomer = await prisma.customer.findUnique({
        where: { userId: user.id }
      })
      
      if (!existingCustomer) {
        await prisma.customer.create({
          data: {
            userId: user.id,
            reviewsCount: 0,
            positivePercentage: 100
          }
        })
      }
    } else if (role === 'SPECIALIST') {
      const existingPro = await prisma.pro.findUnique({
        where: { userId: user.id }
      })
      
      if (!existingPro) {
        await prisma.pro.create({
          data: {
            userId: user.id,
            reviewsCount: 0,
            positivePercentage: 100,
            rating: 0
          }
        })
      }
    }

    return NextResponse.json({ 
      success: true,
      user: updatedUser
    })

  } catch (error) {
    console.error('Error setting role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
