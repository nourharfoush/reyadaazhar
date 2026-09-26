'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('تم إضافة المستخدم بنجاح');
      router.push('/dashboard/users');
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>إضافة مستخدم جديد</h2>
          <p className="text-gray text-sm">إنشاء حساب وإعطاء صلاحيات الدخول</p>
        </div>
        <button onClick={() => router.back()} className="btn btn-outline">العودة</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">الاسم بالكامل</label>
              <input type="text" className="form-control" required placeholder="مثال: محمد أحمد" />
            </div>
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني (اسم المستخدم)</label>
              <input type="email" className="form-control" required placeholder="user@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <input type="password" className="form-control" required placeholder="***" />
            </div>
            <div className="form-group">
              <label className="form-label">الدور</label>
              <select className="form-control" required>
                <option value="">اختر الدور الصلاحية</option>
                <option value="institute_manager">مسؤول معهد</option>
                <option value="administration_supervisor">مسؤول إدارة</option>
                <option value="region_manager">مسؤول منطقة</option>
                <option value="general_admin">مدير عام</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={() => router.back()} className="btn btn-secondary">إلغاء</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ الحساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
