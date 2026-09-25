'use client';
export default function ReportsPage() {
  return (
    <div>
      <div className="mb-6"><h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>التقارير</h2><p className="text-gray text-sm">التقارير الدورية والختامية</p></div>
      <div className="grid-3 mb-6">
        {[{title:'تقرير المعهد',icon:'🏫',desc:'ملخص تنفيذ المشروع بمعهد محدد',href:'/dashboard/reports/institute'},{title:'تقرير الإدارة',icon:'🏢',desc:'مؤشرات الإدارة التعليمية',href:'/dashboard/reports/administration'},{title:'تقرير المنطقة',icon:'🗺',desc:'ملخص المنطقة الأزهرية',href:'/dashboard/reports/region'}].map(r=>(
          <div key={r.title} className="card" style={{cursor:'pointer',transition:'transform 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-4px)')} onMouseLeave={e=>(e.currentTarget.style.transform='')}>
            <div className="card-body" style={{textAlign:'center',padding:32}}>
              <div style={{fontSize:48,marginBottom:16}}>{r.icon}</div>
              <h3 style={{fontSize:'var(--font-size-lg)',fontWeight:'700',marginBottom:8}}>{r.title}</h3>
              <p className="text-sm text-gray mb-4">{r.desc}</p>
              <a href={r.href} className="btn btn-primary btn-sm">إنشاء التقرير</a>
            </div>
          </div>
        ))}
      </div>
      <div className="card"><div className="card-header"><span className="card-title">📄 التقارير السابقة</span></div><div className="empty-state"><div className="empty-state-icon">📄</div><div className="empty-state-title">لا توجد تقارير محفوظة</div><div className="empty-state-desc">ستظهر التقارير المنشأة هنا للرجوع إليها لاحقاً</div></div></div>
    </div>
  );
}
