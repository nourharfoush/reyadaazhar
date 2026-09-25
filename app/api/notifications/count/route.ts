import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getAuthUser } from '@/lib/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorizedResponse();

  try {
    await connectDB();
    const unread = await Notification.countDocuments({ userId: user.id, isRead: false });
    return successResponse({ unread });
  } catch {
    return serverErrorResponse();
  }
}
