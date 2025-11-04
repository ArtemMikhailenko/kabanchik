import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

interface RequestBody {
  categories: string[]
  subcategories: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    console.log('API called with userId:', userId)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const body: RequestBody = await request.json()
    const { categories, subcategories } = body
    console.log('Request body:', { categories, subcategories })

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Categories are required and must be an array' },
        { status: 400 }
      )
    }

    // Сначала найти пользователя, затем Pro
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    console.log('Found user:', user)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Найти специалиста по userId
    const pro = await prisma.pro.findUnique({
      where: { userId: user.id }
    })
    console.log('Found pro:', pro)

    if (!pro) {
      return NextResponse.json(
        { error: 'Specialist profile not found' },
        { status: 404 }
      )
    }

    // Объединяем категории и подкатегории
    const allCategories = [...categories, ...(subcategories || [])]

    // Проверяем, есть ли уже профиль специалиста
    const existingProfile = await prisma.specialistProfile.findUnique({
      where: { proId: pro.id }
    })

    let profile
    if (existingProfile) {
      // Обновляем существующий профиль
      profile = await prisma.specialistProfile.update({
        where: { proId: pro.id },
        data: {
          categories: allCategories
        }
      })
    } else {
      // Создаем новый профиль
      profile = await prisma.specialistProfile.create({
        data: {
          proId: pro.id,
          categories: allCategories
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Categories saved successfully',
      categories: allCategories,
      profile
    })

  } catch (error) {
    console.error('Error saving specialist categories:', error)
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

    // Сначала найти пользователя, затем Pro
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Найти специалиста по userId
    const pro = await prisma.pro.findUnique({
      where: { userId: user.id }
    })

    if (!pro) {
      return NextResponse.json(
        { error: 'Specialist profile not found' },
        { status: 404 }
      )
    }

    // Найти профиль специалиста
    const profile = await prisma.specialistProfile.findUnique({
      where: { proId: pro.id }
    })

    return NextResponse.json({
      categories: profile?.categories || [],
      profile: profile
    })

  } catch (error) {
    console.error('Error fetching specialist categories:', error)
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
