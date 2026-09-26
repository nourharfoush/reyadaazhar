import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
    request.cookies.get('token')?.value ||
    request.cookies.get('sb-access-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'غير مصرح بالوصول' } },
      { status: 401 }
    );
  }

  // Decode JWT payload (Edge runtime safe without heavy dependencies)
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token structure');
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      if (!pathname.startsWith('/api/')) {
        const res = NextResponse.redirect(new URL('/login', request.url));
        res.cookies.delete('token');
        res.cookies.delete('sb-access-token');
        return res;
      }
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'انتهت صلاحية الجلسة' } },
        { status: 401 }
      );
    }

    // Inject user headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId || '');
    requestHeaders.set('x-user-role', payload.role || '');
    requestHeaders.set('x-user-username', payload.username || '');

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    if (!pathname.startsWith('/api/')) {
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.delete('token');
      return res;
    }
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'رمز الدخول غير صالح' } },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
