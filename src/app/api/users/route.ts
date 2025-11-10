import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    console.log('Creating user profile for userId:', userId)

    if (!userId) {
      console.log('No userId found - user not authenticated')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Check if user already exists first (idempotent behavior)
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (existingUser) {
      console.log(
        'User already exists - returning existing user (idempotent POST)'
      )
      return NextResponse.json(
        {
          message: 'User already exists',
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role,
          },
        },
        { status: 200 }
      )
    }

    // Only parse body / validate role if we actually need to create the user
    let role: string | undefined
    try {
      const body = await req.json()
      role = body?.role
    } catch {
      console.log('No JSON body supplied for new user creation')
    }

    console.log('Received role:', role)

    if (!role || (role !== 'CUSTOMER' && role !== 'SPECIALIST')) {
      console.log('Invalid or missing role for new user creation:', role)
      return NextResponse.json(
        {
          error:
            'Invalid role. Must be CUSTOMER or SPECIALIST when creating a new user',
        },
        { status: 400 }
      )
    }

    // Get user info from Clerk
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

    if (!user) {
      console.log('User not found in Clerk')
      return NextResponse.json(
        { error: 'User not found in Clerk' },
        { status: 404 }
      )
    }

    console.log('User data from Clerk:', {
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      emailAddresses: user.emailAddresses.map((e) => e.emailAddress),
    })

    // Create user in database
    const userEmail = user.emailAddresses[0]?.emailAddress || ''
    const userName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || userEmail || 'Unknown'

    console.log('Creating user with name:', userName, 'email:', userEmail)

    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: userEmail,
        name: userName,
        role: role as 'CUSTOMER' | 'SPECIALIST',
      },
    })

    // Create role-specific profile
    if (role === 'CUSTOMER') {
      await prisma.customer.create({
        data: {
          userId: newUser.id,
        },
      })
    } else if (role === 'SPECIALIST') {
      const pro = await prisma.pro.create({
        data: {
          userId: newUser.id,
        },
      })

      // Create specialist profile
      await prisma.specialistProfile.create({
        data: {
          proId: pro.id,
        },
      })
    }

    return NextResponse.json({
      message: 'User profile created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error('Error creating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user info from Clerk to update name if needed
    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)

    if (!clerkUser) {
      return NextResponse.json(
        { error: 'User not found in Clerk' },
        { status: 404 }
      )
    }

    // Find user in database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Determine the best name to use from Clerk
    let userName = existingUser.name
    if (existingUser.name === 'Unknown' || !existingUser.name) {
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || ''
      if (clerkUser.fullName) {
        userName = clerkUser.fullName
      } else if (clerkUser.firstName && clerkUser.lastName) {
        userName = `${clerkUser.firstName} ${clerkUser.lastName}`
      } else if (clerkUser.firstName) {
        userName = clerkUser.firstName
      } else if (clerkUser.lastName) {
        userName = clerkUser.lastName
      } else {
        userName = userEmail || 'Unknown'
      }
    }

    // Update user with latest Clerk data
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        name: userName,
        email: clerkUser.emailAddresses[0]?.emailAddress || existingUser.email,
      },
    })

    return NextResponse.json({
      message: 'User profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
