'use client';
import { useEffect, useState } from 'react';

export default function AdministrationDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center" style={{ minHeight: 300 }}><div className="spinner spinner-lg" /></div>;
  const fmt = (r: number | null) => r === null ? 'غير متاح' : `${Math.round(r)}%`;

  return (
    <div>
      <div className="mb-6">
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', color: 'var(--gray-800)' }}>لوحة الإدارة التعليمية</h2>
        <p className="text-gray text-sm">متابعة المعاهد التابعة للإدارة</p>
      </div>
      <div className="grid-4 mb-6">
        <div className="stat-card"><div className="stat-card-icon blue">🏫</div><div className="stat-card-info"><div className="stat-card-label">المعاهد المستهدفة</div><div className="stat-card-value">{stats?.institutes?.total ?? 0}</div></div></div>
        <div className="stat-card"><div className="stat-card-icon green">▶️</div><div className="stat-card-info"><div className="stat-card-label">بدأت التنفيذ</div><div className="stat-card-value">{stats?.institutes?.implementing ?? 0}</div><div className="stat-card-sub"><span className="badge badge-info">{fmt(stats?.institutes?.spreadRate)} انتشار</span></div></div></div>
        <div className="stat-card"><div className="stat-card-icon teal">🎯</div><div className="stat-card-info"><div className="stat-card-label">المشاركة</div><div className="stat-card-value">{fmt(stats?.students?.participationRate)}</div></div></div>
        <div className="stat-card"><div className="stat-card-icon red">🔧</div><div className="stat-card-info"><div className="stat-card-label">إجراءات مفتوحة</div><div className="stat-card-value">{stats?.correctiveActions?.open ?? 0}</div></div></div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-header"><span className="card-title">⚡ إجراءات سريعة</span></div><div className="card-body" style={{display:'flex',flexDirection:'column',gap:12}}><a href="/dashboard/field-visits/new" className="btn btn-primary btn-sm">🔍 زيارة ميدانية جديدة</a><a href="/dashboard/quality/new" className="btn btn-secondary btn-sm">⭐ تقييم جودة</a><a href="/dashboard/corrective-actions" className="btn btn-secondary btn-sm">🔧 الإجراءات التصحيحية</a></div></div>
        <div className="card"><div className="card-header"><span className="card-title">📊 ملخص الأنشطة</span></div><div className="card-body"><div className="flex justify-between mb-2"><span className="text-sm text-gray">منفذة</span><span className="font-bold">{stats?.activities?.completed ?? 0} / {stats?.activities?.planned ?? 0}</span></div><div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(stats?.activities?.executionRate??0,100)}%`}} /></div><div className="text-xs text-muted text-center mt-2">نسبة التنفيذ: {fmt(stats?.activities?.executionRate)}</div></div></div>
      </div>
    </div>
  );
}
