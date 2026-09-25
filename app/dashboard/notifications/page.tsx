'use client';
export default function NotificationsPage() {
  return (
    <div>
      <div className="mb-6"><h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>الإشعارات</h2><p className="text-gray text-sm">مركز الإشعارات والتنبيهات</p></div>
      <div className="card"><div className="empty-state"><div className="empty-state-icon">🔔</div><div className="empty-state-title">لا توجد إشعارات</div><div className="empty-state-desc">ستظهر إشعارات المهام الجديدة والمواعيد النهائية والإجراءات المتأخرة هنا</div></div></div>
    </div>
  );
}
