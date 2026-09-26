'use client';
import ExcelImportExport from '@/components/ExcelImportExport';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const handleImport = (data: any[]) => {
    console.log('Imported students:', data);
    toast.success(`تم استيراد ${data.length} طالب بنجاح`);
    // Here you would typically send data to your API
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>الطلاب والقياسات</h2>
          <p className="text-gray text-sm">إدارة بيانات الطلاب ونتائج الاختبارات</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <ExcelImportExport 
            templateHeaders={['كود الطالب', 'اسم الطالب', 'الرقم القومي', 'المرحلة', 'الصف', 'الوزن', 'الطول']} 
            templateName="نموذج_الطلاب" 
            onImport={handleImport} 
            buttonLabel="استيراد بيانات الطلاب"
          />
          <a href="/dashboard/students/new" className="btn btn-primary">➕ طالب جديد</a>
        </div>
      </div>
      <div className="card mb-4"><div className="card-body"><div className="grid-3"><div style={{textAlign:'center',padding:'16px',background:'var(--primary-50)',borderRadius:'var(--border-radius-sm)'}}><div style={{fontSize:'32px',fontWeight:'800',color:'var(--primary-600)'}}>—</div><div className="text-sm text-gray">قياسات قبلية</div></div><div style={{textAlign:'center',padding:'16px',background:'var(--warning-50)',borderRadius:'var(--border-radius-sm)'}}><div style={{fontSize:'32px',fontWeight:'800',color:'var(--warning-700)'}}>—</div><div className="text-sm text-gray">قياسات بينية</div></div><div style={{textAlign:'center',padding:'16px',background:'var(--success-50)',borderRadius:'var(--border-radius-sm)'}}><div style={{fontSize:'32px',fontWeight:'800',color:'var(--success-600)'}}>—</div><div className="text-sm text-gray">قياسات بعدية</div></div></div></div></div>
      <div className="alert alert-info mb-4"><span>ℹ️</span><span>يمكن استيراد نتائج الطلاب من ملف Excel مع التحقق من البيانات قبل الاعتماد</span></div>
      <div className="card"><div className="empty-state"><div className="empty-state-icon">🎯</div><div className="empty-state-title">لا توجد قياسات مسجلة</div><div className="empty-state-desc">استورد نتائج الطلاب من ملف Excel أو أدخل القياسات يدوياً</div></div></div>
    </div>
  );
}
