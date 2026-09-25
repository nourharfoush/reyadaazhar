'use client';
export default function FieldVisitsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><div><h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>الزيارات الميدانية</h2><p className="text-gray text-sm">تسجيل ومتابعة الزيارات الميدانية للمعاهد</p></div><a href="/dashboard/field-visits/new" className="btn btn-primary">➕ زيارة جديدة</a></div>
      <div className="card"><div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-title">لا توجد زيارات ميدانية</div><div className="empty-state-desc">سجّل زيارة ميدانية جديدة لمتابعة تنفيذ المشروع في المعاهد وتقييم بنود المتابعة</div><div style={{marginTop:20}}><a href="/dashboard/field-visits/new" className="btn btn-primary">➕ تسجيل زيارة جديدة</a></div></div></div>
    </div>
  );
}
