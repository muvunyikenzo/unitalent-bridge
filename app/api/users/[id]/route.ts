import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        university: true,
        profileImage: true,
        bio: true,
        ratingAverage: true,
        jobsCompleted: true,
        isNewTalent: true,
        createdAt: true,
        services: {
          where: { isActive: true },
          select: {
            id: true, title: true, category: true,
            price: true, priceUnit: true, isActive: true,
          },
          orderBy: { rankingScore: 'desc' },
        },
        reviewsReceived: {
          select: {
            id: true, rating: true, comment: true, createdAt: true,
            reviewer: {
              select: { name: true, profileImage: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[GET /api/users/[id]]', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 }); 
  }
}