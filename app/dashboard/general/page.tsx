'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  institutes: {
    total: number;
    implementing: number;
    completed: number;
    visited: number;
    spreadRate: number | null;
  };
  students: {
    targeted: number;
    participating: number;
    participationRate: number | null;
  };
  activities: {
    planned: number;
    completed: number;
    executionRate: number | null;
  };
  correctiveActions: {
    total: number;
    open: number;
    closed: number;
    overdue: number;
    highPriorityNotStarted: number;
    gapClosureRate: number | null;
  };
}

function formatRate(rate: number | null): string {
  if (rate === null) return 'غير متاح';
  return `${Math.round(rate)}%`;
}

function RateCircle({ rate, label, color }: { rate: number | null; label: string; color: string }) {
  const pct = rate ?? 0;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 12px' }}>
        <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="36" fill="none" stroke="var(--gray-100)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="36"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={rate === null ? circumference : offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: '800',
          color: color,
        }}>
          {formatRate(rate)}
        </div>
      </div>
      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--gray-600)' }}>{label}</div>
    </div>
  );
}

export default function GeneralDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => {
        if (data.success) setStats(data.data);
        else setError('تعذر تحميل البيانات');
      })
      .catch(() => setError('خطأ في الاتصال'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 400, flexDirection: 'column', gap: 16 }}>
        <div className="spinner spinner-lg" />
        <p className="text-gray">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!stats) return null;

  const { institutes, students, activities, correctiveActions } = stats;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', color: 'var(--gray-800)', marginBottom: 4 }}>
            اللوحة العامة للمشروع
          </h2>
          <p className="text-gray text-sm">المشروع القومي للياقة البدنية بالمعاهد الأزهرية</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">📤 تصدير</button>
          <button className="btn btn-primary btn-sm">🔄 تحديث</button>
        </div>
      </div>

      {/* Alert: overdue actions */}
      {correctiveActions.overdue > 0 && (
        <div className="alert alert-danger mb-4">
          <span>⚠️</span>
          <span>
            <strong>{correctiveActions.overdue}</strong> إجراء تصحيحي تجاوز موعده المستهدف ويحتاج مراجعة فورية.
            <a href="/dashboard/corrective-actions?overdue=true" style={{ marginRight: 8, textDecoration: 'underline' }}>
              عرض التفاصيل
            </a>
          </span>
        </div>
      )}

      {/* Stat Cards - Institutes */}
      <div className="section-header">
        <span className="section-title">مؤشرات المعاهد</span>
        <a href="/dashboard/institutes" className="btn btn-ghost btn-sm text-primary">عرض الكل ←</a>
      </div>
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-card-icon blue">🏫</div>
          <div className="stat-card-info">
            <div className="stat-card-label">إجمالي المعاهد</div>
            <div className="stat-card-value">{institutes.total.toLocaleString('ar-EG')}</div>
            <div className="stat-card-sub">المستهدفة بالمشروع</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">▶️</div>
          <div className="stat-card-info">
            <div className="stat-card-label">معاهد بدأت التنفيذ</div>
            <div className="stat-card-value">{institutes.implementing.toLocaleString('ar-EG')}</div>
            <div className="stat-card-sub">
              <span className="badge badge-success">{formatRate(institutes.spreadRate)} انتشار</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon teal">✅</div>
          <div className="stat-card-info">
            <div className="stat-card-label">معاهد مستكملة</div>
            <div className="stat-card-value">{institutes.completed.toLocaleString('ar-EG')}</div>
            <div className="stat-card-sub">تمت الخطة والاعتماد</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon blue">🔍</div>
          <div className="stat-card-info">
            <div className="stat-card-label">معاهد تمت متابعتها</div>
            <div className="stat-card-value">{institutes.visited.toLocaleString('ar-EG')}</div>
            <div className="stat-card-sub">بزيارات ميدانية مكتملة</div>
          </div>
        </div>
      </div>

      {/* Stat Cards - Students */}
      <div className="section-header">
        <span className="section-title">مؤشرات الطلاب</span>
        <a href="/dashboard/students" className="btn btn-ghost btn-sm text-primary">عرض الكل ←</a>
      </div>
      <div className="grid-3 mb-6">
        <div className="stat-card">
          <div className="stat-card-icon blue">👥</div>
          <div className="stat-card-info">
            <div className="stat-card-label">الطلاب المستهدفون</div>
            <div className="stat-card-value">{students.targeted.toLocaleString('ar-EG')}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">🎯</div>
          <div className="stat-card-info">
            <div className="stat-card-label">الطلاب المشاركون</div>
            <div className="stat-card-value">{students.participating.toLocaleString('ar-EG')}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon teal">📈</div>
          <div className="stat-card-info">
            <div className="stat-card-label">نسبة المشاركة</div>
            <div className="stat-card-value">{formatRate(students.participationRate)}</div>
            <div className="stat-card-sub">من إجمالي المستهدفين</div>
          </div>
        </div>
      </div>

      {/* KPI Circles */}
      <div className="card mb-6">
        <div className="card-header">
          <span className="card-title">📊 مؤشرات الأداء الرئيسية</span>
          <span className="badge badge-info">محسوبة تلقائياً</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32 }}>
            <RateCircle rate={institutes.spreadRate} label="الانتشار" color="var(--primary-500)" />
            <RateCircle rate={students.participationRate} label="المشاركة" color="var(--accent-500)" />
            <RateCircle rate={activities.executionRate} label="التنفيذ" color="var(--success-600)" />
            <RateCircle rate={correctiveActions.gapClosureRate} label="إغلاق الفجوات" color="var(--warning-600)" />
          </div>
        </div>
      </div>

      {/* Activities & Corrective Actions */}
      <div className="grid-2 mb-6">
        {/* Activities */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📋 الأنشطة</span>
          </div>
          <div className="card-body">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray">الأنشطة المنفذة</span>
              <span className="font-bold">{activities.completed.toLocaleString('ar-EG')} / {activities.planned.toLocaleString('ar-EG')}</span>
            </div>
            <div className="progress-bar mb-3">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(activities.executionRate ?? 0, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>المخططة: {activities.planned.toLocaleString('ar-EG')}</span>
              <span>نسبة الإنجاز: {formatRate(activities.executionRate)}</span>
            </div>
          </div>
        </div>

        {/* Corrective Actions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🔧 الإجراءات التصحيحية</span>
            <a href="/dashboard/corrective-actions" className="btn btn-ghost btn-sm text-primary">إدارة ←</a>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--danger-50)', borderRadius: 'var(--border-radius-sm)' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--danger-600)' }}>
                  {correctiveActions.open}
                </div>
                <div className="text-xs" style={{ color: 'var(--danger-700)' }}>مفتوحة</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--success-50)', borderRadius: 'var(--border-radius-sm)' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--success-600)' }}>
                  {correctiveActions.closed}
                </div>
                <div className="text-xs" style={{ color: 'var(--success-700)' }}>مغلقة</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--warning-50)', borderRadius: 'var(--border-radius-sm)' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--warning-700)' }}>
                  {correctiveActions.overdue}
                </div>
                <div className="text-xs" style={{ color: 'var(--warning-700)' }}>متأخرة</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--danger-50)', borderRadius: 'var(--border-radius-sm)' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--danger-700)' }}>
                  {correctiveActions.highPriorityNotStarted}
                </div>
                <div className="text-xs" style={{ color: 'var(--danger-700)' }}>عالية الأولوية لم تبدأ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">⚡ الإجراءات السريعة</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/dashboard/field-visits/new" className="btn btn-primary btn-sm">➕ زيارة ميدانية جديدة</a>
            <a href="/dashboard/corrective-actions/new" className="btn btn-secondary btn-sm">🔧 إجراء تصحيحي جديد</a>
            <a href="/dashboard/quality/new" className="btn btn-secondary btn-sm">⭐ تقييم جودة جديد</a>
            <a href="/dashboard/students/import" className="btn btn-secondary btn-sm">📥 استيراد نتائج طلاب</a>
            <a href="/dashboard/reports" className="btn btn-secondary btn-sm">📄 إنشاء تقرير</a>
          </div>
        </div>
      </div>
    </div>
  );
}
