import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if customer profile exists
    let customer = await prisma.customer.findUnique({
      where: { userId }
    })

    if (!customer) {
      // Create customer profile
      customer = await prisma.customer.create({
        data: {
          userId,
          isActive: true
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      customer: {
        id: customer.id,
        userId: customer.userId,
        isActive: customer.isActive
      }
    })

  } catch (error) {
    console.error('Error creating/getting customer profile:', error)
    return NextResponse.json(
      { error: 'Failed to create customer profile' },
      { status: 500 }
    )
  }
}
