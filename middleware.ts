import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/reset-password',
  '/_next',
  '/favicon.ico',
  '/public',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookies or Authorization header
  const token =
    request.cookies.get('sb-access-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    // Redirect to login for page routes
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'غير مصرح بالوصول' } }, { status: 401 });
  }

  // Verify token with Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      if (!pathname.startsWith('/api/')) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('sb-access-token');
        return response;
      }
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'انتهت صلاحية الجلسة' } }, { status: 401 });
    }

    // Inject user id into headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-email', user.email || '');

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'خطأ في التحقق من الهوية' } }, { status: 500 });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
