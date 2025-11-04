import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary, extractCloudinaryPublicId } from '@/lib/cloudinary';

function generateId(): string {
  return `cuid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tagsString = formData.get('tags') as string;
    const file = formData.get('file') as File;

    console.log('Received data:', { title, description, tagsString, fileName: file?.name });

    if (!file || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 10MB for portfolio images)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with portfolio-specific transformations
    const { secureUrl: imageUrl } = await uploadToCloudinary({
      file: buffer,
      fileName: file.name,
      folder: 'portfolio',
      transformation: {
        width: 800,
        height: 600,
        crop: 'limit',
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    });

    // Parse tags
    let tags: string[] = [];
    if (tagsString) {
      try {
        tags = JSON.parse(tagsString);
        console.log('Parsed tags:', tags);
      } catch (error) {
        console.error('Error parsing tags:', error);
        tags = [];
      }
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Save to database using raw SQL to handle array properly
    const portfolioId = generateId();
    const result = await prisma.$executeRaw`
      INSERT INTO portfolio_items (id, "userId", image, title, description, tags, "createdAt", "updatedAt")
      VALUES (${portfolioId}, ${user.id}, ${imageUrl}, ${title}, ${description || null}, ${tags}::text[], NOW(), NOW())
    `;

    console.log('Database insert result:', result);

    return NextResponse.json({ 
      success: true, 
      portfolioItem: {
        id: portfolioId,
        userId: user.id,
        image: imageUrl,
        title,
        description,
        tags
      }
    });

  } catch (error) {
    console.error('Error saving portfolio item:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        portfolioItems: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ portfolioItems: user.portfolioItems });

  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get('id');

    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio item ID is required' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the portfolio item
    const portfolioItem = await prisma.portfolioItem.findFirst({
      where: {
        id: portfolioId,
        userId: user.id
      }
    });

    if (!portfolioItem) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    // Delete image from Cloudinary if it's a Cloudinary URL
    if (portfolioItem.image && portfolioItem.image.includes('cloudinary.com')) {
      const publicId = extractCloudinaryPublicId(portfolioItem.image);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error('Error deleting portfolio image from Cloudinary:', error);
          // Continue with database deletion even if Cloudinary deletion fails
        }
      }
    }

    // Delete from database
    await prisma.portfolioItem.delete({
      where: { id: portfolioId }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Portfolio item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
