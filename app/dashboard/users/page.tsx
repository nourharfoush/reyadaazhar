'use client';
import ExcelImportExport from '@/components/ExcelImportExport';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const handleImport = (data: any[]) => {
    console.log('Imported users:', data);
    toast.success(`تم استيراد ${data.length} مستخدم بنجاح`);
    // Send data to API here
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>إدارة المستخدمين</h2>
          <p className="text-gray text-sm">الحسابات والأدوار والصلاحيات (المناطق، الإدارات، وغيرها)</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <ExcelImportExport 
            templateHeaders={['الاسم', 'البريد الإلكتروني', 'الدور (منطقة/إدارة/معهد)', 'الجهة التابع لها']} 
            templateName="نموذج_المستخدمين" 
            onImport={handleImport} 
            buttonLabel="استيراد المستخدمين"
          />
          <a href="/dashboard/users/new" className="btn btn-primary">➕ مستخدم جديد</a>
        </div>
      </div>
      <div className="card"><div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-title">لا يوجد مستخدمون</div><div className="empty-state-desc">أضف مستخدمين وحدد أدوارهم ونطاقات صلاحياتهم التنظيمية</div><div style={{marginTop:20}}><a href="/dashboard/users/new" className="btn btn-primary">➕ إضافة مستخدم</a></div></div></div>
    </div>
  );
}
