import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION', message: 'البريد الإلكتروني وكلمة المرور مطلوبان' } },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user || !data.session) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_FAILED', message: 'بيانات الدخول غير صحيحة' } },
        { status: 401 }
      );
    }

    // Get user from MongoDB
    await connectDB();
    const dbUser = await User.findOne({ supabaseId: data.user.id }).lean();

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'الحساب غير موجود في النظام' } },
        { status: 401 }
      );
    }

    if (!(dbUser as any).isActive) {
      return NextResponse.json(
        { success: false, error: { code: 'ACCOUNT_DISABLED', message: 'الحساب معطل. تواصل مع مدير النظام' } },
        { status: 401 }
      );
    }

    // Update last login
    await User.findByIdAndUpdate((dbUser as any)._id, { lastLogin: new Date() });

    // Log the login
    try {
      await AuditLog.create({
        userId: (dbUser as any)._id,
        userEmail: (dbUser as any).email,
        userRole: (dbUser as any).role,
        action: 'LOGIN',
        entityType: 'User',
        entityId: (dbUser as any)._id.toString(),
        description: `تسجيل دخول المستخدم ${(dbUser as any).name}`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        timestamp: new Date(),
      });
    } catch { /* non-critical */ }

    // Set cookie and return response
    const response = NextResponse.json({
      success: true,
      data: {
        role: (dbUser as any).role,
        name: (dbUser as any).name,
        email: (dbUser as any).email,
        accessToken: data.session.access_token,
      },
    });

    response.cookies.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'حدث خطأ في الخادم' } },
      { status: 500 }
    );
  }
}
