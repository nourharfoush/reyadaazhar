import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
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
  username: string;
  email?: string;
  role: UserRole;
  name: string;
  scopeId?: string;
  scopeType?: string;
  regionId?: string;
  administrationId?: string;
  instituteId?: string;
  isActive: boolean;
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET || 'reyada-super-secret-jwt-key-2026-azhar';

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  req.cookies.get('token')?.value ||
                  req.cookies.get('sb-access-token')?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    await connectDB();
    const dbUser = await User.findById(decoded.userId).lean();
    if (!dbUser || !(dbUser as any).isActive) return null;

    return {
      id: (dbUser as any)._id.toString(),
      username: (dbUser as any).username,
      email: (dbUser as any).email,
      role: (dbUser as any).role,
      name: (dbUser as any).name,
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
  if (user.role === 'region_manager') return true;
  if (user.role === 'administration_supervisor') return user.administrationId === administrationId;
  if (user.role === 'institute_manager') return user.administrationId === administrationId;
  return false;
}

export function canAccessInstitute(user: AuthUser, instituteId: string): boolean {
  if (['general_admin', 'system_admin'].includes(user.role)) return true;
  if (user.role === 'region_manager') return true;
  if (user.role === 'administration_supervisor') return true;
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
