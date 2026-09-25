'use client';
export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><div><h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>إدارة المستخدمين</h2><p className="text-gray text-sm">الحسابات والأدوار والصلاحيات</p></div><a href="/dashboard/users/new" className="btn btn-primary">➕ مستخدم جديد</a></div>
      <div className="card"><div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-title">لا يوجد مستخدمون</div><div className="empty-state-desc">أضف مستخدمين وحدد أدوارهم ونطاقات صلاحياتهم التنظيمية</div><div style={{marginTop:20}}><a href="/dashboard/users/new" className="btn btn-primary">➕ إضافة مستخدم</a></div></div></div>
    </div>
  );
}
