'use client';
import ExcelImportExport from '@/components/ExcelImportExport';
import toast from 'react-hot-toast';

export default function InstitutesPage() {
  const handleImport = (data: any[]) => {
    console.log('Imported institutes:', data);
    toast.success(`تم استيراد ${data.length} معهد بنجاح`);
    // Send data to API here
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>المعاهد</h2>
          <p className="text-gray text-sm">قائمة المعاهد المشاركة في المشروع</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <ExcelImportExport 
            templateHeaders={['كود المعهد', 'اسم المعهد', 'المنطقة الأزهرية', 'الإدارة التعليمية', 'المرحلة', 'نوع المعهد']} 
            templateName="نموذج_المعاهد" 
            onImport={handleImport} 
            buttonLabel="استيراد المعاهد"
          />
          <a href="/dashboard/institutes/new" className="btn btn-primary">➕ معهد جديد</a>
        </div>
      </div>
      <div className="filter-bar"><input type="text" className="form-control" placeholder="🔍 بحث باسم المعهد أو الكود..." /><select className="form-control" style={{maxWidth:160}}><option value="">كل المراحل</option><option>ابتدائي</option><option>إعدادي</option><option>ثانوي</option></select></div>
      <div className="card"><div className="empty-state"><div className="empty-state-icon">🏫</div><div className="empty-state-title">لا توجد معاهد</div><div className="empty-state-desc">ستظهر المعاهد المسجلة في النظام هنا. تأكد من إضافة بيانات المعاهد أولاً.</div></div></div>
    </div>
  );
}
