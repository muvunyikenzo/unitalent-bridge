import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }
  try {
    const { serviceId, rating, comment, imageUrl } = await req.json();
    if (!serviceId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { userId: true },
    });
    if (!service) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }
    if (service.userId === session.user.id) {
      return NextResponse.json({ error: 'You cannot review your own service.' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        serviceId,
        reviewerId: session.user.id,
        providerId: service.userId,
        rating: parseInt(rating),
        comment: comment.trim(),
        imageUrl: imageUrl ?? null,
      },
    });

    // Update provider stats
    const reviews = await prisma.review.findMany({
      where: { providerId: service.userId },
      select: { rating: true },
    });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await prisma.user.update({
      where: { id: service.userId },
      data: {
        ratingAverage: avg,
        jobsCompleted: reviews.length,
        isNewTalent: reviews.length < 3,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}