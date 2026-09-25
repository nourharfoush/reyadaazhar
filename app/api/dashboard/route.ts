import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Institute from '@/models/Institute';
import InstitutePlan from '@/models/InstitutePlan';
import FieldVisit from '@/models/FieldVisit';
import CorrectiveAction from '@/models/CorrectiveAction';
import Student from '@/models/Student';
import { getAuthUser, buildScopeFilter } from '@/lib/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse, safeDivide } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const cycleId = searchParams.get('cycle_id');

    const scopeFilter = buildScopeFilter(user);

    // Build filter for this user scope
    const adminFilter: Record<string, unknown> = {};
    const instituteFilter: Record<string, unknown> = { isActive: true };
    if (scopeFilter.administrationId) {
      adminFilter.administrationId = scopeFilter.administrationId;
      instituteFilter.administrationId = scopeFilter.administrationId;
    }
    if (scopeFilter.regionId) {
      adminFilter.regionId = scopeFilter.regionId;
      instituteFilter.regionId = scopeFilter.regionId;
    }
    if (scopeFilter.instituteId) {
      instituteFilter._id = scopeFilter.instituteId;
    }

    const planFilter: Record<string, unknown> = {};
    const visitFilter: Record<string, unknown> = {};
    const caFilter: Record<string, unknown> = {};
    const studentFilter: Record<string, unknown> = {};

    if (cycleId) {
      planFilter.academicCycleId = cycleId;
      visitFilter.academicCycleId = cycleId;
      caFilter.academicCycleId = cycleId;
    }

    // Apply scope to sub-collections via instituteId
    let authorizedInstituteIds: string[] = [];
    const institutes = await Institute.find(instituteFilter).select('_id targetStudents').lean();
    authorizedInstituteIds = institutes.map((i: any) => i._id.toString());
    const totalTargetStudents = institutes.reduce((sum: number, i: any) => sum + (i.targetStudents || 0), 0);

    if (authorizedInstituteIds.length > 0) {
      planFilter.instituteId = { $in: authorizedInstituteIds };
      visitFilter.instituteId = { $in: authorizedInstituteIds };
      caFilter.instituteId = { $in: authorizedInstituteIds };
      studentFilter.instituteId = { $in: authorizedInstituteIds };
    }

    // Parallel data fetch
    const [
      totalInstitutes,
      plans,
      visits,
      openActions,
      overdueActions,
      highPriorityActions,
      totalStudents,
      closedActions,
      totalActions,
    ] = await Promise.all([
      Institute.countDocuments(instituteFilter),
      InstitutePlan.find(planFilter).select('instituteId activities status').lean(),
      FieldVisit.countDocuments({ ...visitFilter, status: 'مكتملة' }),
      CorrectiveAction.countDocuments({ ...caFilter, gapStatus: 'مفتوحة' }),
      CorrectiveAction.countDocuments({ ...caFilter, gapStatus: { $ne: 'مغلقة' }, targetCompletionDate: { $lt: new Date() } }),
      CorrectiveAction.countDocuments({ ...caFilter, gapStatus: { $ne: 'مغلقة' }, priority: 'مرتفعة', implementationStatus: 'لم يبدأ' }),
      Student.countDocuments(studentFilter),
      CorrectiveAction.countDocuments({ ...caFilter, gapStatus: 'مغلقة' }),
      CorrectiveAction.countDocuments(caFilter),
    ]);

    // Plans stats
    const implementingInstitutes = new Set(plans.map((p: any) => p.instituteId.toString())).size;
    const completedInstitutes = plans.filter((p: any) => p.status === 'معتمد').length;

    // Activities stats
    let totalActivities = 0;
    let completedActivities = 0;
    for (const plan of plans as any[]) {
      totalActivities += plan.activities?.length || 0;
      completedActivities += plan.activities?.filter((a: any) => a.status === 'مكتمل').length || 0;
    }

    const spreadRate = safeDivide(implementingInstitutes, totalInstitutes);
    const executionRate = safeDivide(completedActivities, totalActivities);
    const gapClosureRate = safeDivide(closedActions, totalActions);

    return successResponse({
      institutes: {
        total: totalInstitutes,
        implementing: implementingInstitutes,
        completed: completedInstitutes,
        visited: visits,
        spreadRate,
      },
      students: {
        targeted: totalTargetStudents,
        participating: totalStudents,
        participationRate: safeDivide(totalStudents, totalTargetStudents),
      },
      activities: {
        planned: totalActivities,
        completed: completedActivities,
        executionRate,
      },
      correctiveActions: {
        total: totalActions,
        open: openActions,
        closed: closedActions,
        overdue: overdueActions,
        highPriorityNotStarted: highPriorityActions,
        gapClosureRate,
      },
    });
  } catch (err) {
    console.error('Dashboard API error:', err);
    return serverErrorResponse();
  }
}
