'use client';

import { useEffect, useState } from 'react';

export default function InstituteDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center" style={{ minHeight: 300 }}>
      <div className="spinner spinner-lg" />
    </div>
  );

  const formatRate = (r: number | null) => r === null ? 'غير متاح' : `${Math.round(r)}%`;

  return (
    <div>
      <div className="mb-6">
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', color: 'var(--gray-800)' }}>
          لوحة متابعة المعهد
        </h2>
        <p className="text-gray text-sm">ملخص تنفيذ المشروع القومي للياقة البدنية</p>
      </div>

      {stats?.correctiveActions?.overdue > 0 && (
        <div className="alert alert-warning mb-4">
          <span>⚠️</span>
          <span>لديك <strong>{stats.correctiveActions.overdue}</strong> إجراء تصحيحي تجاوز موعده</span>
        </div>
      )}

      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-card-icon blue">📋</div>
          <div className="stat-card-info">
            <div className="stat-card-label">الأنشطة المخططة</div>
            <div className="stat-card-value">{stats?.activities?.planned ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">✅</div>
          <div className="stat-card-info">
            <div className="stat-card-label">الأنشطة المنفذة</div>
            <div className="stat-card-value">{stats?.activities?.completed ?? 0}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon teal">📈</div>
          <div className="stat-card-info">
            <div className="stat-card-label">نسبة الإنجاز</div>
            <div className="stat-card-value">{formatRate(stats?.activities?.executionRate)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red">🔧</div>
          <div className="stat-card-info">
            <div className="stat-card-label">إجراءات مفتوحة</div>
            <div className="stat-card-value">{stats?.correctiveActions?.open ?? 0}</div>
          </div>
        </div>
      </div>

      <div className="grid-2 mb-6">
        <div className="card">
          <div className="card-header">
            <span className="card-title">👥 الطلاب</span>
          </div>
          <div className="card-body">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray">المستهدفون</span>
              <span className="font-bold">{stats?.students?.targeted ?? 0}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray">المشاركون</span>
              <span className="font-bold">{stats?.students?.participating ?? 0}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(stats?.students?.participationRate ?? 0, 100)}%` }} />
            </div>
            <div className="text-xs text-muted mt-2 text-center">نسبة المشاركة: {formatRate(stats?.students?.participationRate)}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">⚡ إجراءات سريعة</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="/dashboard/plans" className="btn btn-primary btn-sm">📋 تحديث خطة التنفيذ</a>
            <a href="/dashboard/students/import" className="btn btn-secondary btn-sm">📥 إدخال نتائج الطلاب</a>
            <a href="/dashboard/capacity" className="btn btn-secondary btn-sm">💪 تسجيل جلسة بناء القدرات</a>
          </div>
        </div>
      </div>
    </div>
  );
}
