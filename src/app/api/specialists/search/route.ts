import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const service = searchParams.get('service')
    const city = searchParams.get('city')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    console.log('Search params:', { service, city, page, limit })

    // Bootstrap: ensure users with role SPECIALIST have a Pro record
    try {
      const missingPros = await prisma.user.findMany({
        where: { role: 'SPECIALIST', pro: null },
        select: { id: true, bio: true },
        take: 50
      })
      if (missingPros.length > 0) {
        console.log(`Bootstrapping ${missingPros.length} missing Pro records`)
        for (const u of missingPros) {
          const pro = await prisma.pro.create({
            data: { userId: u.id, isVerified: false, isActive: true }
          })
          // Create minimal profile to avoid null checks downstream
          await prisma.specialistProfile.create({
            data: { proId: pro.id, bio: u.bio || null, skills: [] }
          })
        }
      }
    } catch (e) {
      console.warn('Specialists search: bootstrap of Pro records failed or skipped', e)
    }

    // Build where clause for filtering
    const where: any = {
      isActive: true
      // Убираем требование isVerified: true для тестирования
    }

        // Filter by service/category if provided
  if (service && service !== '') {
      // Try to find category by name or slug (both main category and subcategory)
      const category = await prisma.category.findFirst({
        where: {
          OR: [
            { name: service },
            { slug: service }
          ],
          isActive: true
        }
      })

      // If found by slug/name, use the name; otherwise use the original search term
      const searchTerm = category ? category.name : service

      // Search in profile categories (which store category names or service names)
      // Include specialists without a profile as well so fresh Google sign-ups are visible
      where.AND = [
        {
          OR: [
            { profile: { categories: { hasSome: [searchTerm, service] } } },
            { profile: null }
          ]
        }
      ]
    }

    // Get specialists with their user data
    const specialists = await prisma.pro.findMany({
      where,
      include: {
        user: true,
        profile: true
      },
      skip,
      take: limit,
      orderBy: [
        { isVerified: 'desc' },
        // If profile is missing, orderBy on nested fields can error; keep them last via nullsLast implicit behavior
        { profile: { rating: 'desc' } },
        { profile: { reviewCount: 'desc' } }
      ]
    })

    // Get total count for pagination
    const totalCount = await prisma.pro.count({ where })
    const totalPages = Math.ceil(totalCount / limit)

    // Transform data to match frontend interface
    const transformedSpecialists = specialists.map(specialist => {
      // Calculate real rating or use default
      const realRating = specialist.profile?.rating ? Number(specialist.profile.rating) : 0
      const displayRating = realRating > 0 ? realRating : 5 // Show 5 stars for new specialists
      
      // Calculate positive percentage from reviews (if available)
      const reviewCount = specialist.profile?.reviewCount || 0
      const displayPositivePercentage = reviewCount > 0 ? 95 : 100 // Default to 100% for new specialists
      
      return {
        id: specialist.id,
        name: specialist.user?.name || specialist.user?.email?.split('@')[0] || 'Specialist',
        title: specialist.profile?.bio?.substring(0, 50) || service || 'Professional Specialist',
        avatar: specialist.user?.avatar || null, // Use null instead of mock image
        rating: displayRating,
        reviewsCount: reviewCount,
        positivePercentage: displayPositivePercentage,
        description: specialist.profile?.bio || 'Professional specialist ready to help you with your project.',
        isVerified: !!specialist.isVerified,
        isCustomerSafe: !!specialist.isVerified, // Link to verification status
        skills: specialist.profile?.skills || [],
        categories: specialist.profile?.categories || [],
        hourlyRate: specialist.profile?.hourlyRate ? Number(specialist.profile.hourlyRate) : null,
        availability: specialist.profile?.availability || null
      }
    })

    return NextResponse.json({
      specialists: transformedSpecialists,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        service,
        city
      }
    })

  } catch (error) {
    console.error('Error searching specialists:', error)
    const errAny: any = error
    const msg: string = errAny?.message || ''
    const code: string | undefined = errAny?.code
    if (code === 'P1001' || msg.includes("Can't reach database server")) {
      console.warn('DB unavailable (P1001) during specialists search. Returning empty list.')
      return NextResponse.json({
        specialists: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false
        },
        filters: {}
      })
    }
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Failed to search specialists', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
