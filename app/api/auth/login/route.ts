import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const loginIdentifier = (body.username || body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION', message: 'اسم المستخدم وكلمة المرور مطلوبان' } },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if system has any users; if not, auto-seed default admin
    const totalUsers = await User.countDocuments();
    if (totalUsers === 0) {
      const defaultPasswordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@azhar.edu.eg',
        passwordHash: defaultPasswordHash,
        name: 'مدير النظام العام',
        role: 'system_admin',
        isActive: true,
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_FAILED', message: 'اسم المستخدم أو كلمة المرور غير صحيحة' } },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: { code: 'ACCOUNT_DISABLED', message: 'هذا الحساب معطل، يرجى مراجعة إدارة النظام' } },
        { status: 403 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_FAILED', message: 'اسم المستخدم أو كلمة المرور غير صحيحة' } },
        { status: 401 }
      );
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Sign JWT token
    const token = signToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    // Audit log
    try {
      await AuditLog.create({
        userId: user._id,
        userEmail: user.email || user.username,
        userRole: user.role,
        action: 'LOGIN',
        entityType: 'User',
        entityId: user._id.toString(),
        description: `تسجيل دخول ناجح للمستخدم ${user.name} (${user.username})`,
        ipAddress: req.headers.get('x-forwarded-for') || undefined,
        timestamp: new Date(),
      });
    } catch {
      // non-critical
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        role: user.role,
        regionId: user.regionId?.toString(),
        administrationId: user.administrationId?.toString(),
        instituteId: user.instituteId?.toString(),
        token,
      },
    });

    // Set cookies
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'حدث خطأ في الخادم' } },
      { status: 500 }
    );
  }
}
