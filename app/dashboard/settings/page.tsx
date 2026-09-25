'use client';
export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6"><h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>الإعدادات</h2><p className="text-gray text-sm">إعدادات النظام والمعايير</p></div>
      <div className="grid-2 mb-4">
        {[{icon:'📅',title:'دورات المشروع',desc:'إدارة السنوات الدراسية ودورات المشروع',href:'/dashboard/settings/cycles'},{icon:'🏋️',title:'الاختبارات البدنية',desc:'تعريف اختبارات اللياقة ووحدات القياس',href:'/dashboard/settings/tests'},{icon:'📊',title:'معايير التحويل',desc:'جداول تحويل الدرجات الخام إلى معيارية',href:'/dashboard/settings/standards'},{icon:'🎯',title:'مستويات الأداء',desc:'تعريف حدود مستويات أداء الطلاب',href:'/dashboard/settings/levels'},{icon:'🗺️',title:'المناطق والإدارات',desc:'إدارة الهيكل التنظيمي للمناطق',href:'/dashboard/settings/regions'},{icon:'🔒',title:'سجل التدقيق',desc:'عرض سجلات العمليات الحساسة',href:'/dashboard/settings/audit'}].map(s=>(
          <a key={s.title} href={s.href} style={{textDecoration:'none'}}>
            <div className="card" style={{cursor:'pointer',transition:'all 0.2s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow='var(--shadow-md)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow=''}}>
              <div className="card-body" style={{display:'flex',alignItems:'center',gap:16}}>
                <div style={{fontSize:32}}>{s.icon}</div>
                <div><div style={{fontWeight:'700',color:'var(--gray-800)',marginBottom:4}}>{s.title}</div><div className="text-sm text-gray">{s.desc}</div></div>
                <div style={{marginRight:'auto',color:'var(--gray-400)'}}>←</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
