import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { successResponse, unauthorizedResponse } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();

  return successResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    regionId: user.regionId,
    administrationId: user.administrationId,
    instituteId: user.instituteId,
  });
}
