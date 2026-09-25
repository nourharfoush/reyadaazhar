import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Institute from '@/models/Institute';
import { getAuthUser, buildScopeFilter } from '@/lib/auth';
import { successResponse, unauthorizedResponse, paginatedResponse, getPagination, serverErrorResponse } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);

    const filter: Record<string, unknown> = { isActive: true };

    // Apply RBAC scope filter
    const scopeFilter = buildScopeFilter(user);
    if (scopeFilter.instituteId) filter._id = scopeFilter.instituteId;
    else if (scopeFilter.administrationId) filter.administrationId = scopeFilter.administrationId;
    else if (scopeFilter.regionId) filter.regionId = scopeFilter.regionId;

    // Additional query filters
    const regionId = searchParams.get('region_id');
    const administrationId = searchParams.get('administration_id');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    if (regionId) filter.regionId = regionId;
    if (administrationId) filter.administrationId = administrationId;
    if (level) filter.educationalLevel = level;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { instituteCode: { $regex: search, $options: 'i' } },
      ];
    }

    const [institutes, total] = await Promise.all([
      Institute.find(filter)
        .populate('regionId', 'name code')
        .populate('administrationId', 'name code')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Institute.countDocuments(filter),
    ]);

    return paginatedResponse(institutes, total, page, limit);
  } catch (err) {
    console.error('GET /api/institutes error:', err);
    return serverErrorResponse();
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();
  if (!['general_admin', 'system_admin', 'administration_supervisor'].includes(user.role)) {
    return successResponse({ error: 'غير مصرح' }, 403);
  }

  try {
    await connectDB();
    const body = await req.json();
    const institute = await Institute.create(body);
    return successResponse(institute, 201);
  } catch (err: any) {
    if (err.code === 11000) return successResponse({ error: 'كود المعهد مستخدم مسبقاً' }, 409);
    return serverErrorResponse();
  }
}
