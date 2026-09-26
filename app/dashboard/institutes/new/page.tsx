'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewInstitutePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('تم إضافة المعهد بنجاح');
      router.push('/dashboard/institutes');
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>إضافة معهد جديد</h2>
          <p className="text-gray text-sm">تسجيل معهد جديد في المنظومة</p>
        </div>
        <button onClick={() => router.back()} className="btn btn-outline">العودة</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">اسم المعهد</label>
              <input type="text" className="form-control" required placeholder="اسم المعهد بالكامل" />
            </div>
            <div className="form-group">
              <label className="form-label">المنطقة الأزهرية</label>
              <select className="form-control" required>
                <option value="">اختر المنطقة</option>
                <option value="القاهرة">القاهرة</option>
                <option value="الجيزة">الجيزة</option>
                <option value="الإسكندرية">الإسكندرية</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">الإدارة التعليمية</label>
              <input type="text" className="form-control" required placeholder="الإدارة التعليمية" />
            </div>
            <div className="form-group">
              <label className="form-label">نوع المعهد</label>
              <select className="form-control" required>
                <option value="">اختر النوع</option>
                <option value="بنين">بنين</option>
                <option value="فتيات">فتيات</option>
                <option value="مشترك">مشترك</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={() => router.back()} className="btn btn-secondary">إلغاء</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ المعهد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
