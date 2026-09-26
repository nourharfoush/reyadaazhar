'use client';

import React, { useRef } from 'react';
import * as XLSX from 'xlsx';

interface ExcelImportExportProps {
  templateHeaders: string[];
  templateName: string;
  onImport: (data: any[]) => void;
  buttonLabel?: string;
}

export default function ExcelImportExport({
  templateHeaders,
  templateName,
  onImport,
  buttonLabel = 'استيراد من إكسيل'
}: ExcelImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([templateHeaders]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${templateName}.xlsx`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;

      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      onImport(data);
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button 
        onClick={handleExportTemplate}
        className="btn btn-outline"
        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid var(--primary-500)', color: 'var(--primary-600)', background: 'transparent', cursor: 'pointer' }}
      >
        📥 تحميل نموذج فارغ
      </button>

      <button 
        onClick={() => fileInputRef.current?.click()}
        className="btn btn-primary"
        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: 'var(--primary-600)', color: 'white', cursor: 'pointer' }}
      >
        📤 {buttonLabel}
      </button>

      <input 
        type="file" 
        accept=".xlsx, .xls" 
        ref={fileInputRef} 
        onChange={handleImport} 
        style={{ display: 'none' }} 
      />
    </div>
  );
}
