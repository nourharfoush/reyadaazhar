'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        if (!data.success) { router.push('/login'); return; }
        const role = data.data.role;
        if (role === 'institute_manager') router.push('/dashboard/institute');
        else if (role === 'administration_supervisor') router.push('/dashboard/administration');
        else if (role === 'region_manager') router.push('/dashboard/region');
        else router.push('/portal');
      })
      .catch(() => router.push('/login'));
  }, [router]);

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <div className="spinner spinner-lg" />
      <p className="text-gray">جاري التوجيه...</p>
    </div>
  );
}
