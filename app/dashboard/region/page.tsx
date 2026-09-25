'use client';
import { useEffect, useState } from 'react';

export default function RegionDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/dashboard').then(r=>r.json()).then(d=>{if(d.success)setStats(d.data);}).finally(()=>setLoading(false));
  }, []);
  if (loading) return <div className="flex items-center justify-center" style={{minHeight:300}}><div className="spinner spinner-lg" /></div>;
  const fmt = (r:number|null)=>r===null?'غير متاح':`${Math.round(r)}%`;
  return (
    <div>
      <div className="mb-6"><h2 style={{fontSize:'var(--font-size-2xl)',fontWeight:'800',color:'var(--gray-800)'}}>لوحة المنطقة الأزهرية</h2><p className="text-gray text-sm">قيادة الدعم والتحسين للمنطقة</p></div>
      <div className="grid-4 mb-6">
        <div className="stat-card"><div className="stat-card-icon blue">🏫</div><div className="stat-card-info"><div className="stat-card-label">معاهد المنطقة</div><div className="stat-card-value">{stats?.institutes?.total??0}</div></div></div>
        <div className="stat-card"><div className="stat-card-icon green">📊</div><div className="stat-card-info"><div className="stat-card-label">معدل الانتشار</div><div className="stat-card-value">{fmt(stats?.institutes?.spreadRate)}</div></div></div>
        <div className="stat-card"><div className="stat-card-icon teal">🎯</div><div className="stat-card-info"><div className="stat-card-label">معدل المشاركة</div><div className="stat-card-value">{fmt(stats?.students?.participationRate)}</div></div></div>
        <div className="stat-card"><div className="stat-card-icon orange">🔧</div><div className="stat-card-info"><div className="stat-card-label">فجوات مفتوحة</div><div className="stat-card-value">{stats?.correctiveActions?.open??0}</div></div></div>
      </div>
      <div className="grid-3 mb-6">
        <div className="stat-card"><div className="stat-card-icon blue">📈</div><div className="stat-card-info"><div className="stat-card-label">معدل التنفيذ</div><div className="stat-card-value">{fmt(stats?.activities?.executionRate)}</div></div></div>
        <div className="stat-card"><div className="stat-card-icon green">✅</div><div className="stat-card-info"><div className="stat-card-label">فجوات مغلقة</div><div className="stat-card-value">{stats?.correctiveActions?.closed??0}</div></div></div>
        <div className="stat-card"><div className="stat-card-icon red">⏰</div><div className="stat-card-info"><div className="stat-card-label">إجراءات متأخرة</div><div className="stat-card-value">{stats?.correctiveActions?.overdue??0}</div></div></div>
      </div>
      <div className="card"><div className="card-header"><span className="card-title">⚡ إجراءات سريعة</span></div><div className="card-body"><div style={{display:'flex',gap:12,flexWrap:'wrap'}}><a href="/dashboard/institutes" className="btn btn-primary btn-sm">🏫 معاهد المنطقة</a><a href="/dashboard/corrective-actions?priority=مرتفعة" className="btn btn-danger btn-sm">⚠️ الأولوية المرتفعة</a><a href="/dashboard/reports" className="btn btn-secondary btn-sm">📄 تقرير المنطقة</a></div></div></div>
    </div>
  );
}
