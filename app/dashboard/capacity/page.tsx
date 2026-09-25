'use client';
export default function CapacityPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><div><h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>برنامج بناء القدرات البدنية</h2><p className="text-gray text-sm">متابعة جلسات التدريب والمحطات</p></div><a href="/dashboard/capacity/new" className="btn btn-primary">➕ جلسة جديدة</a></div>
      <div className="grid-3 mb-4">
        <div className="stat-card"><div className="stat-card-icon blue">💪</div><div className="stat-card-info"><div className="stat-card-label">إجمالي الجلسات</div><div className="stat-card-value">—</div></div></div>
        <div className="stat-card"><div className="stat-card-icon green">👥</div><div className="stat-card-info"><div className="stat-card-label">متوسط الحضور</div><div className="stat-card-value">—</div></div></div>
        <div className="stat-card"><div className="stat-card-icon teal">📈</div><div className="stat-card-info"><div className="stat-card-label">معدل الانتظام</div><div className="stat-card-value">—</div></div></div>
      </div>
      <div className="card"><div className="empty-state"><div className="empty-state-icon">💪</div><div className="empty-state-title">لا توجد جلسات مسجلة</div><div className="empty-state-desc">سجّل جلسات برنامج بناء القدرات البدنية ونظام المحطات لمتابعة الانتظام والحضور</div><div style={{marginTop:20}}><a href="/dashboard/capacity/new" className="btn btn-primary">➕ تسجيل جلسة</a></div></div></div>
    </div>
  );
}
