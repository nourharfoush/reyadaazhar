'use client';
export default function PlansPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>خطط التنفيذ</h2><p className="text-gray text-sm">إدارة خطط تنفيذ المشروع بالمعاهد</p></div>
        <a href="/dashboard/plans/new" className="btn btn-primary">➕ خطة جديدة</a>
      </div>
      <div className="card"><div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">جاري تحميل خطط التنفيذ</div><div className="empty-state-desc">ستظهر خطط التنفيذ هنا. يمكنك إنشاء خطة جديدة أو الاطلاع على الخطط الموجودة.</div><div style={{marginTop:20}}><a href="/dashboard/plans/new" className="btn btn-primary">➕ إنشاء خطة جديدة</a></div></div></div>
    </div>
  );
}
