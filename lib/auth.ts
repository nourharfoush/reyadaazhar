import { NextRequest } from 'next/server';
import { supabaseAdmin } from './supabase';
import connectDB from './mongodb';
import User from '@/models/User';

export type UserRole =
  | 'institute_manager'
  | 'administration_supervisor'
  | 'region_manager'
  | 'general_admin'
  | 'system_admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  scopeId?: string;    // معرف النطاق (معهد / إدارة / منطقة)
  scopeType?: string;  // نوع النطاق
  regionId?: string;
  administrationId?: string;
  instituteId?: string;
  isActive: boolean;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  req.cookies.get('sb-access-token')?.value;

    if (!token) return null;

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;

    await connectDB();
    const dbUser = await User.findOne({ supabaseId: user.id, isActive: true }).lean();
    if (!dbUser) return null;

    return {
      id: (dbUser as any)._id.toString(),
      email: (dbUser as any).email,
      role: (dbUser as any).role,
      name: (dbUser as any).name,
      scopeId: (dbUser as any).scopeId?.toString(),
      scopeType: (dbUser as any).scopeType,
      regionId: (dbUser as any).regionId?.toString(),
      administrationId: (dbUser as any).administrationId?.toString(),
      instituteId: (dbUser as any).instituteId?.toString(),
      isActive: (dbUser as any).isActive,
    };
  } catch {
    return null;
  }
}

export function canAccessRegion(user: AuthUser, regionId: string): boolean {
  if (['general_admin', 'system_admin'].includes(user.role)) return true;
  if (user.role === 'region_manager') return user.regionId === regionId;
  if (user.role === 'administration_supervisor') return user.regionId === regionId;
  if (user.role === 'institute_manager') return user.regionId === regionId;
  return false;
}

export function canAccessAdministration(user: AuthUser, administrationId: string): boolean {
  if (['general_admin', 'system_admin'].includes(user.role)) return true;
  if (user.role === 'region_manager') return true; // within their region
  if (user.role === 'administration_supervisor') return user.administrationId === administrationId;
  if (user.role === 'institute_manager') return user.administrationId === administrationId;
  return false;
}

export function canAccessInstitute(user: AuthUser, instituteId: string): boolean {
  if (['general_admin', 'system_admin'].includes(user.role)) return true;
  if (user.role === 'region_manager') return true;
  if (user.role === 'administration_supervisor') return true; // within their administration
  if (user.role === 'institute_manager') return user.instituteId === instituteId;
  return false;
}

export function requireRole(user: AuthUser, roles: UserRole[]): boolean {
  return roles.includes(user.role);
}

export function buildScopeFilter(user: AuthUser): Record<string, string> {
  const filter: Record<string, string> = {};
  if (user.role === 'institute_manager' && user.instituteId) {
    filter.instituteId = user.instituteId;
  } else if (user.role === 'administration_supervisor' && user.administrationId) {
    filter.administrationId = user.administrationId;
  } else if (user.role === 'region_manager' && user.regionId) {
    filter.regionId = user.regionId;
  }
  return filter;
}
