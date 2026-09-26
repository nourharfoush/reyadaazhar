import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ success: false, error: { message: 'اسم المستخدم مطلوب' } }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({
      $or: [{ username: username.trim().toLowerCase() }, { email: username.trim().toLowerCase() }],
    });

    if (!user) {
      return NextResponse.json({ success: true, message: 'إذا كان الحساب مسجلاً، يرجى مراجعة مدير النظام لإعادة ضبط كلمة المرور' });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'يرجى التواصل مع مدير النظام لإعادة تعيين كلمة المرور لحسابك' 
    });
  } catch {
    return NextResponse.json({ success: false, error: { message: 'حدث خطأ في معالجة الطلب' } }, { status: 500 });
  }
}
