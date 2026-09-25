import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Region from '@/models/Region';
import { getAuthUser } from '@/lib/auth';
import { successResponse, unauthorizedResponse, paginatedResponse, getPagination, serverErrorResponse } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);
    const isActive = searchParams.get('active') !== 'false';

    const filter: Record<string, unknown> = { isActive };

    // If user is region_manager, only show their region
    if (user.role === 'region_manager' && user.regionId) {
      filter._id = user.regionId;
    }

    const [regions, total] = await Promise.all([
      Region.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Region.countDocuments(filter),
    ]);

    return paginatedResponse(regions, total, page, limit);
  } catch (err) {
    console.error('GET /api/regions error:', err);
    return serverErrorResponse();
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();
  if (!['general_admin', 'system_admin'].includes(user.role)) {
    return successResponse(null, 403);
  }

  try {
    await connectDB();
    const body = await req.json();
    const { name, code } = body;

    if (!name || !code) {
      return successResponse({ error: 'الاسم والكود مطلوبان' }, 400);
    }

    const region = await Region.create({ name, code });
    return successResponse(region, 201);
  } catch (err: any) {
    if (err.code === 11000) {
      return successResponse({ error: 'الكود مستخدم مسبقاً' }, 409);
    }
    return serverErrorResponse();
  }
}
