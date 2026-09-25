import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import CorrectiveAction from '@/models/CorrectiveAction';
import AuditLog from '@/models/AuditLog';
import { getAuthUser, canAccessInstitute } from '@/lib/auth';
import { successResponse, unauthorizedResponse, forbiddenResponse, notFoundResponse, serverErrorResponse } from '@/lib/utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();
  const { id } = await params;

  try {
    await connectDB();
    const action = await CorrectiveAction.findById(id)
      .populate('instituteId', 'name instituteCode educationalLevel')
      .populate('regionId', 'name')
      .populate('administrationId', 'name')
      .populate('supervisorId', 'name email')
      .populate('responsiblePersonId', 'name email')
      .populate('parentActionId', 'referenceCode gapDescription')
      .lean();

    if (!action) return notFoundResponse('الإجراء التصحيحي غير موجود');

    if (!canAccessInstitute(user, (action as any).instituteId?._id?.toString())) {
      return forbiddenResponse();
    }

    return successResponse(action);
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();
  const { id } = await params;

  try {
    await connectDB();
    const action = await CorrectiveAction.findById(id);
    if (!action) return notFoundResponse();

    if (!canAccessInstitute(user, action.instituteId.toString())) {
      return forbiddenResponse();
    }

    const body = await req.json();

    // Prevent closing without re-monitoring result (unless admin exception)
    if (body.gapStatus === 'مغلقة' && !action.reMonitoringDone && !body.closureReason) {
      return successResponse(
        { error: 'لا يمكن إغلاق الفجوة دون تسجيل نتيجة إعادة المتابعة أو تقديم مبرر موثق' },
        400
      );
    }

    const oldValues = action.toObject();
    Object.assign(action, body);
    if (body.gapStatus === 'مغلقة') {
      action.closedAt = new Date();
      action.closedBy = user.id as any;
    }
    action.lastUpdatedAt = new Date();
    await action.save();

    // Audit log for sensitive changes
    await AuditLog.create({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: 'UPDATE',
      entityType: 'CorrectiveAction',
      entityId: id,
      description: `تحديث الإجراء التصحيحي ${action.referenceCode}`,
      oldValues: { gapStatus: oldValues.gapStatus, implementationStatus: oldValues.implementationStatus },
      newValues: { gapStatus: action.gapStatus, implementationStatus: action.implementationStatus },
      timestamp: new Date(),
    });

    return successResponse(action);
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }
}
