import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

interface UpdateProfileRequest {
  name?: string
  email?: string
  bio?: string
  avatar?: string
  city?: string
  birthDate?: string
  hourlyRate?: number
  skills?: string[]
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const body: UpdateProfileRequest = await request.json()
    const { name, email, bio, avatar, city, birthDate, hourlyRate, skills } = body

    // Найти пользователя
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { 
        pro: { 
          include: { profile: true } 
        } 
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Обновляем основные данные пользователя
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        email: email || user.email,
        bio: bio !== undefined ? bio : user.bio,
        avatar: avatar !== undefined ? avatar : user.avatar,
        ...(city !== undefined && { city }),
        ...(birthDate !== undefined && { birthDate })
      }
    })

    // Если пользователь специалист, обновляем профиль специалиста
    if (user.pro) {
      let specialistProfile = user.pro.profile

      if (specialistProfile) {
        // Обновляем существующий профиль
        specialistProfile = await prisma.specialistProfile.update({
          where: { proId: user.pro.id },
          data: {
            bio: bio !== undefined ? bio : specialistProfile.bio,
            hourlyRate: hourlyRate !== undefined ? hourlyRate : specialistProfile.hourlyRate,
            skills: skills !== undefined ? skills : specialistProfile.skills
          }
        })
      } else {
        // Создаем новый профиль если его нет
        specialistProfile = await prisma.specialistProfile.create({
          data: {
            proId: user.pro.id,
            bio: bio || null,
            hourlyRate: hourlyRate || null,
            skills: skills || []
          }
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
        specialistProfile
      })
    }

    return NextResponse.json({
      success: true,
      message: 'User profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    // Найти пользователя со всеми связанными данными
    let user: any = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { 
        pro: { 
          include: { profile: true } 
        },
        customer: true
      }
    }) as any

    if (!user) {
      // Автоматически создать пользователя в БД при первом заходе
      try {
        const { createClerkClient } = await import('@clerk/nextjs/server')
        const clerkClient = createClerkClient({
          secretKey: process.env.CLERK_SECRET_KEY!,
        })
        const clerkUser = await clerkClient.users.getUser(userId)
        const primaryEmail = clerkUser.emailAddresses.find(
          (e) => e.id === clerkUser.primaryEmailAddressId
        )?.emailAddress

        const roleFromMetadata = (clerkUser.publicMetadata?.role || clerkUser.unsafeMetadata?.role) as
          | 'SPECIALIST'
          | 'CUSTOMER'
          | undefined

        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: primaryEmail || 'unknown@example.com',
            name: clerkUser.firstName || clerkUser.username || null,
            role: roleFromMetadata as any,
          },
          include: {
            pro: { include: { profile: true } },
            customer: true,
          },
        })
      } catch (e) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
    }

    // Ensure role-specific records exist (bootstrap Pro/Customer if missing)
    try {
      if (user.role === 'SPECIALIST' && !user.pro) {
        const pro = await prisma.pro.create({
          data: {
            userId: user.id,
            isVerified: false,
            isActive: true,
          },
          include: { profile: true }
        })
        // Create minimal specialist profile if missing
        if (!pro.profile) {
          await prisma.specialistProfile.create({
            data: {
              proId: pro.id,
              bio: user.bio || null,
              skills: [],
            }
          })
        }
        // Refresh user snapshot with relations
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { pro: { include: { profile: true } }, customer: true }
        })
      }
      if (user.role === 'CUSTOMER' && !user.customer) {
        await prisma.customer.create({
          data: {
            userId: user.id,
            isActive: true,
          }
        })
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { pro: { include: { profile: true } }, customer: true }
        })
      }
    } catch (e) {
      console.warn('Profile GET: failed to bootstrap role-specific record', e)
    }

  // Вычисляем статистику отзывов
  const reviews = (user as any).reviewsReceived || []
    const reviewsCount = reviews.length
    const averageRating = reviewsCount > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviewsCount 
      : 0
    const positiveReviews = reviews.filter((review: any) => review.isPositive).length
    const positivePercentage = reviewsCount > 0 
      ? Math.round((positiveReviews / reviewsCount) * 100) 
      : 100

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        city: user.city,
        birthDate: user.birthDate,
        role: user.role,
        createdAt: user.createdAt,
        isVerified: user.pro?.isVerified || false,
        profile: user.pro?.profile,
        // Добавляем реальную статистику отзывов
        reviewsCount,
        averageRating: Number(averageRating.toFixed(1)),
        positivePercentage,
        // Добавляем данные тарифного плана для специалистов
        subscription: user.pro?.profile ? {
          plan: (user.pro.profile as any).subscriptionPlan || 'Basic',
          validUntil: (user.pro.profile as any).subscriptionValidUntil 
            ? new Date((user.pro.profile as any).subscriptionValidUntil).toLocaleDateString() 
            : '12 December 2024'
        } : { plan: 'Basic', validUntil: 'N/A' }
      }
    })

  } catch (error) {
    console.error('Error fetching profile:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
