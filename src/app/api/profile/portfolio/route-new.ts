import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from 'path';
import fs from 'fs/promises';

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

    // Save file
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'portfolio');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    
    const bytes = await file.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(bytes));
    
    const imageUrl = `/uploads/portfolio/${filename}`;

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
