import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import CorrectiveAction from '@/models/CorrectiveAction';
import AuditLog from '@/models/AuditLog';
import { getAuthUser, buildScopeFilter, canAccessInstitute } from '@/lib/auth';
import { successResponse, unauthorizedResponse, forbiddenResponse, paginatedResponse, getPagination, serverErrorResponse, generateReferenceCode } from '@/lib/utils';
import Institute from '@/models/Institute';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPagination(searchParams);

    const filter: Record<string, unknown> = {};

    // Apply scope
    const scopeFilter = buildScopeFilter(user);
    if (scopeFilter.instituteId) filter.instituteId = scopeFilter.instituteId;
    else if (scopeFilter.administrationId) filter.administrationId = scopeFilter.administrationId;
    else if (scopeFilter.regionId) filter.regionId = scopeFilter.regionId;

    // Additional filters
    const gapStatus = searchParams.get('gap_status');
    const priority = searchParams.get('priority');
    const instituteId = searchParams.get('institute_id');
    const cycleId = searchParams.get('cycle_id');
    const search = searchParams.get('search');
    const overdue = searchParams.get('overdue');

    if (gapStatus) filter.gapStatus = gapStatus;
    if (priority) filter.priority = priority;
    if (instituteId) filter.instituteId = instituteId;
    if (cycleId) filter.academicCycleId = cycleId;
    if (search) {
      filter.$or = [
        { referenceCode: { $regex: search, $options: 'i' } },
        { gapDescription: { $regex: search, $options: 'i' } },
        { instituteCode: { $regex: search, $options: 'i' } },
      ];
    }
    if (overdue === 'true') {
      filter.targetCompletionDate = { $lt: new Date() };
      filter.gapStatus = { $ne: 'مغلقة' };
    }

    const [actions, total] = await Promise.all([
      CorrectiveAction.find(filter)
        .populate('instituteId', 'name instituteCode')
        .populate('supervisorId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CorrectiveAction.countDocuments(filter),
    ]);

    return paginatedResponse(actions, total, page, limit);
  } catch (err) {
    console.error('GET /api/corrective-actions error:', err);
    return serverErrorResponse();
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();

  if (user.role === 'institute_manager') {
    return forbiddenResponse('مسؤول المعهد لا يملك صلاحية فتح إجراء تصحيحي');
  }

  try {
    await connectDB();
    const body = await req.json();

    // Validate the user can access this institute
    if (!canAccessInstitute(user, body.instituteId)) {
      return forbiddenResponse('لا تملك صلاحية الوصول إلى هذا المعهد');
    }

    // Get institute code for reference generation
    const institute = await Institute.findById(body.instituteId).lean();
    if (!institute) return successResponse({ error: 'المعهد غير موجود' }, 404);

    // Generate reference code
    const year = new Date().getFullYear();
    const count = await CorrectiveAction.countDocuments({
      instituteId: body.instituteId,
      createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
    });
    const refCode = generateReferenceCode('CA', (institute as any).instituteCode, year, count + 1);

    const action = await CorrectiveAction.create({
      ...body,
      referenceCode: refCode,
      instituteCode: (institute as any).instituteCode,
      supervisorId: user.id,
      supervisorName: user.name,
      gapStatus: 'مفتوحة',
      implementationStatus: 'لم يبدأ',
      completionPercentage: 0,
      reMonitoringDone: false,
    });

    // Audit log
    await AuditLog.create({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: 'CREATE',
      entityType: 'CorrectiveAction',
      entityId: action._id.toString(),
      description: `فتح إجراء تصحيحي ${refCode} للمعهد ${(institute as any).name}`,
      timestamp: new Date(),
    });

    return successResponse(action, 201);
  } catch (err) {
    console.error('POST /api/corrective-actions error:', err);
    return serverErrorResponse();
  }
}
