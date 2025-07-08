import { NextRequest, NextResponse } from 'next/server'
import { auth, createClerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

function validateRole(roleString: unknown): 'SPECIALIST' | 'CUSTOMER' | null {
  if (roleString === 'SPECIALIST' || roleString === 'CUSTOMER') {
    return roleString
  }
  return null
}

interface RequestBody {
  role?: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    let roleFromBody: string | null = null
    try {
      const body: RequestBody = await request.json()
      roleFromBody = body.role || null
    } catch {
      // Continue without body
    }

    const roleFromHeader = request.headers.get('X-User-Role')

    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    })

    const user = await clerkClient.users.getUser(userId)
    const primaryEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress

    const name = user.firstName || user.username || null

    const roleFromMetadata =
      user.publicMetadata?.role || user.unsafeMetadata?.role
    const roleCandidate = roleFromBody || roleFromHeader || roleFromMetadata
    const role = validateRole(roleCandidate)

    if (!primaryEmail) {
      return NextResponse.json(
        { error: 'User email not found in Clerk' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { pro: true, customer: true },
    })

    if (existing) {
      return NextResponse.json({
        ...existing,
        message: 'User already exists',
      })
    }

    const result = await prisma.$transaction(async (tx) => {
      const dbUser = await tx.user.create({
        data: {
          clerkId: userId,
          email: primaryEmail,
          name: name,
          role: role,
        },
      })

      let profileType = 'basic'

      if (role === 'SPECIALIST') {
        await tx.pro.create({ data: { userId: dbUser.id } })
        profileType = 'specialist'
      } else if (role === 'CUSTOMER') {
        await tx.customer.create({ data: { userId: dbUser.id } })
        profileType = 'customer'
      }

      return { user: dbUser, profileType }
    })

    if (role) {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: role,
          profileCreated: true,
          profileType: result.profileType,
        },
      })
    }

    return NextResponse.json({
      ...result.user,
      profileType: result.profileType,
      success: true,
      message: `${role ? `${role} profile` : 'User'} created successfully`,
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json(
      {
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
