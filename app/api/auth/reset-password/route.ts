import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: { message: 'البريد الإلكتروني مطلوب' } }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: false, error: { message: 'خدمة المصادقة غير متاحة' } }, { status: 503 });
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`;
    await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true, message: 'تم إرسال رابط الاستعادة إذا كان البريد مسجلاً' });
  } catch {
    return NextResponse.json({ success: false, error: { message: 'حدث خطأ' } }, { status: 500 });
  }
}
