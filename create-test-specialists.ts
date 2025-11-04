import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestSpecialists() {
  try {
    console.log('Creating test specialists...')

    // Create test users with SPECIALIST role
    const testUsers = await Promise.all([
      prisma.user.create({
        data: {
          clerkId: 'test_specialist_1',
          email: 'specialist1@test.com',
          name: 'Alex Johnson',
          role: 'SPECIALIST',
          avatar: '/photo.png'
        }
      }),
      prisma.user.create({
        data: {
          clerkId: 'test_specialist_2', 
          email: 'specialist2@test.com',
          name: 'Maria Garcia',
          role: 'SPECIALIST',
          avatar: '/photo.png'
        }
      }),
      prisma.user.create({
        data: {
          clerkId: 'test_specialist_3',
          email: 'specialist3@test.com', 
          name: 'David Smith',
          role: 'SPECIALIST',
          avatar: '/photo.png'
        }
      })
    ])

    // Create Pro profiles
    const testPros = await Promise.all(
      testUsers.map(user => 
        prisma.pro.create({
          data: {
            userId: user.id,
            isActive: true,
            isVerified: true
          }
        })
      )
    )

    // Create Specialist profiles
    await Promise.all([
      prisma.specialistProfile.create({
        data: {
          proId: testPros[0].id,
          bio: 'Experienced home services specialist with 5+ years of experience.',
          skills: ['Repair', 'Maintenance', 'Installation'],
          categories: ['Home Services'],
          hourlyRate: 25.00,
          availability: 'Monday-Friday 9AM-6PM',
          portfolio: [],
          rating: 4.8,
          reviewCount: 127
        }
      }),
      prisma.specialistProfile.create({
        data: {
          proId: testPros[1].id,
          bio: 'Professional tech services specialist specializing in software and hardware.',
          skills: ['Programming', 'IT Support', 'Web Development'],
          categories: ['Tech Services'],
          hourlyRate: 45.00,
          availability: 'Available 24/7',
          portfolio: [],
          rating: 4.9,
          reviewCount: 89
        }
      }),
      prisma.specialistProfile.create({
        data: {
          proId: testPros[2].id,
          bio: 'Creative services expert offering design and multimedia solutions.',
          skills: ['Graphic Design', 'Video Editing', 'Photography'],
          categories: ['Creative Services'],
          hourlyRate: 35.00,
          availability: 'Monday-Saturday 10AM-8PM',
          portfolio: [],
          rating: 4.7,
          reviewCount: 203
        }
      })
    ])

    console.log('Test specialists created successfully!')
  } catch (error) {
    console.error('Error creating test specialists:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestSpecialists()
