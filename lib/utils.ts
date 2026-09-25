import { NextResponse } from 'next/server';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400, code = 'ERROR', details?: unknown) {
  const body: { success: boolean; error: ApiError } = {
    success: false,
    error: { code, message, details },
  };
  return NextResponse.json(body, { status });
}

export function unauthorizedResponse(message = 'غير مصرح بالوصول') {
  return errorResponse(message, 401, 'UNAUTHORIZED');
}

export function forbiddenResponse(message = 'لا تملك صلاحية للوصول إلى هذا المورد') {
  return errorResponse(message, 403, 'FORBIDDEN');
}

export function notFoundResponse(message = 'السجل غير موجود') {
  return errorResponse(message, 404, 'NOT_FOUND');
}

export function serverErrorResponse(message = 'حدث خطأ في الخادم') {
  return errorResponse(message, 500, 'SERVER_ERROR');
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// Parse pagination params from URL
export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// Format date for display
export function formatDate(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Safe division for indicators
export function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return (numerator / denominator) * 100;
}

// Generate reference code e.g. CA-INST001-2026-0001
export function generateReferenceCode(
  prefix: string,
  instituteCode: string,
  year: number,
  sequence: number
): string {
  return `${prefix}-${instituteCode}-${year}-${String(sequence).padStart(4, '0')}`;
}
