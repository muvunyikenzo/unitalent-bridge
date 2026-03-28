import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '10'));
  const category = searchParams.get('category') ?? '';

  const where: Record<string, unknown> = { isOpen: true };
  if (category) where.category = { equals: category, mode: 'insensitive' };

  const [total, requests] = await Promise.all([
    prisma.serviceRequest.count({ where }),
    prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, title: true, category: true, description: true,
        budget: true, deadline: true, responsesCount: true, createdAt: true,
        user: { select: { id: true, name: true, profileImage: true } },
      },
    }),
  ]);

  return NextResponse.json({ data: requests, total, page, limit, hasMore: page * limit < total });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }
  try {
    const { title, category, description, budget, deadline } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }
    const request = await prisma.serviceRequest.create({
      data: {
        userId: session.user.id,
        title: title.trim(),
        category: category ?? null,
        description: description.trim(),
        budget: budget ? parseInt(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
      },
    });
    return NextResponse.json(request, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to post request.' }, { status: 500 });
  }
}