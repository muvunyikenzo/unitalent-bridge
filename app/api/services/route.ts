import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';
    const category = searchParams.get('category') ?? '';
    const sort = searchParams.get('sort') ?? 'ranking';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '12'));

    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const orderByMap: Record<string, unknown> = {
      ranking:    [{ rankingScore: 'desc' }, { createdAt: 'desc' }],
      price_asc:  { price: 'asc' },
      price_desc: { price: 'desc' },
      newest:     { createdAt: 'desc' },
      rating:     [{ user: { ratingAverage: 'desc' } }],
    };

    const [total, services] = await Promise.all([
      prisma.service.count({ where }),
      prisma.service.findMany({
        where,
        orderBy: orderByMap[sort] ?? orderByMap.ranking,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          category: true,
          price: true,
          priceUnit: true,
          location: true,
          portfolioImages: true,
          rankingScore: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              ratingAverage: true,
              jobsCompleted: true,
              isNewTalent: true,
              createdAt: true,
            },
          },
          _count: { select: { reviews: true } },
        },
      }),
    ]);

    return NextResponse.json({
      data: services,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    });

  } catch (error) {
    console.error('[GET /api/services]', error);
    return NextResponse.json(
      { data: [], total: 0, page: 1, limit: 12, hasMore: false },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, description, price, priceUnit, location, portfolioImages, userId } = body;

    if (!title || !category || !description || !price || !userId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        userId,
        title: title.trim(),
        category,
        description: description.trim(),
        price: parseInt(price),
        priceUnit: priceUnit ?? 'per session',
        location: location ?? null,
        portfolioImages: portfolioImages ?? [],
        rankingScore: 10,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('[POST /api/services]', error);
    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 });
  }
}