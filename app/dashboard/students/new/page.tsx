'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('تم إضافة الطالب بنجاح');
      router.push('/dashboard/students');
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>إضافة طالب جديد</h2>
          <p className="text-gray text-sm">أدخل بيانات الطالب للبدء في تتبع قياساته</p>
        </div>
        <button onClick={() => router.back()} className="btn btn-outline">العودة</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">اسم الطالب</label>
              <input type="text" className="form-control" required placeholder="مثال: أحمد محمد" />
            </div>
            <div className="form-group">
              <label className="form-label">الرقم القومي</label>
              <input type="text" className="form-control" required placeholder="14 رقم" minLength={14} maxLength={14} />
            </div>
            <div className="form-group">
              <label className="form-label">المرحلة الدراسية</label>
              <select className="form-control" required>
                <option value="">اختر المرحلة</option>
                <option value="ابتدائي">ابتدائي</option>
                <option value="إعدادي">إعدادي</option>
                <option value="ثانوي">ثانوي</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">الصف</label>
              <select className="form-control" required>
                <option value="">اختر الصف</option>
                <option value="الأول">الأول</option>
                <option value="الثاني">الثاني</option>
                <option value="الثالث">الثالث</option>
                <option value="الرابع">الرابع</option>
                <option value="الخامس">الخامس</option>
                <option value="السادس">السادس</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={() => router.back()} className="btn btn-secondary">إلغاء</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ البيانات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
