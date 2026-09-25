'use client';
export default function QualityPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><div><h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>تقييم الجودة</h2><p className="text-gray text-sm">تقييم جودة التنفيذ بالمقياس الرباعي (1-4)</p></div><a href="/dashboard/quality/new" className="btn btn-primary">➕ تقييم جديد</a></div>
      <div className="grid-3 mb-4">
        {['التخطيط','التنفيذ','المشاركة','جودة الأداء','الأثر والنتائج'].map(axis=>(
          <div key={axis} className="stat-card"><div className="stat-card-icon blue">⭐</div><div className="stat-card-info"><div className="stat-card-label">{axis}</div><div className="stat-card-value text-muted" style={{fontSize:'var(--font-size-lg)'}}>—</div><div className="stat-card-sub">لا توجد بيانات</div></div></div>
        ))}
      </div>
      <div className="card"><div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-title">لا توجد تقييمات جودة</div><div className="empty-state-desc">ابدأ بإنشاء تقييم جودة جديد مرتبط بمعهد وفترة زمنية</div><div style={{marginTop:20}}><a href="/dashboard/quality/new" className="btn btn-primary">⭐ إنشاء تقييم جودة</a></div></div></div>
    </div>
  );
}
