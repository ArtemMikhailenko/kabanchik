import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { uploadToCloudinary, deleteFromCloudinary, extractCloudinaryPublicId } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete old avatar from Cloudinary if exists
    if (user.avatar && user.avatar.includes('cloudinary.com')) {
      const oldPublicId = extractCloudinaryPublicId(user.avatar)
      if (oldPublicId) {
        try {
          await deleteFromCloudinary(oldPublicId)
        } catch (error) {
          console.error('Error deleting old avatar from Cloudinary:', error)
          // Continue with upload even if deletion fails
        }
      }
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary with avatar-specific transformations
    const { secureUrl: avatarUrl } = await uploadToCloudinary({
      file: buffer,
      fileName: file.name,
      folder: 'avatars',
      transformation: {
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    })

    // Update user's avatar in database
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: avatarUrl }
    })

    return NextResponse.json({ 
      success: true, 
      avatarUrl,
      message: 'Avatar updated successfully' 
    })

  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
