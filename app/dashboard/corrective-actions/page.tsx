'use client';

import { useEffect, useState, useCallback } from 'react';

type GapStatus = 'مفتوحة' | 'مغلقة جزئيًا' | 'مغلقة';
type Priority = 'مرتفعة' | 'متوسطة' | 'منخفضة';

interface CorrectiveAction {
  _id: string;
  referenceCode: string;
  instituteId: { name: string; instituteCode: string };
  gapAxis: string;
  gapDescription: string;
  priority: Priority;
  gapStatus: GapStatus;
  implementationStatus: string;
  completionPercentage: number;
  targetCompletionDate: string;
  responsiblePersonName: string;
  supervisorName: string;
  createdAt: string;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cls = priority === 'مرتفعة' ? 'badge-danger' : priority === 'متوسطة' ? 'badge-warning' : 'badge-gray';
  return <span className={`badge ${cls}`}>{priority}</span>;
}

function GapStatusBadge({ status }: { status: GapStatus }) {
  const cls = status === 'مغلقة' ? 'badge-success' : status === 'مغلقة جزئيًا' ? 'badge-warning' : 'badge-danger';
  const dot = status === 'مغلقة' ? 'green' : status === 'مغلقة جزئيًا' ? 'yellow' : 'red';
  return (
    <span className={`badge ${cls}`}>
      <span className={`status-dot ${dot}`} />
      {status}
    </span>
  );
}

export default function CorrectiveActionsPage() {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    gap_status: '',
    priority: '',
    overdue: '',
    search: '',
  });

  const fetchActions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15' });
    if (filters.gap_status) params.set('gap_status', filters.gap_status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.overdue) params.set('overdue', filters.overdue);
    if (filters.search) params.set('search', filters.search);

    const res = await fetch(`/api/corrective-actions?${params}`);
    const data = await res.json();
    if (data.success) {
      setActions(data.data);
      setTotal(data.pagination.total);
    }
    setLoading(false);
  }, [page, filters]);

  useEffect(() => { fetchActions(); }, [fetchActions]);

  const totalPages = Math.ceil(total / 15);
  const isOverdue = (date: string, status: GapStatus) =>
    new Date(date) < new Date() && status !== 'مغلقة';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', color: 'var(--gray-800)', marginBottom: 4 }}>
            الإجراءات التصحيحية
          </h2>
          <p className="text-gray text-sm">
            {total.toLocaleString('ar-EG')} إجراء تصحيحي إجمالاً
          </p>
        </div>
        <a href="/dashboard/corrective-actions/new" className="btn btn-primary">
          ➕ إجراء تصحيحي جديد
        </a>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 بحث بالكود أو الوصف أو كود المعهد..."
          value={filters.search}
          onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
        />
        <select
          className="form-control"
          style={{ maxWidth: 160 }}
          value={filters.gap_status}
          onChange={e => { setFilters(f => ({ ...f, gap_status: e.target.value })); setPage(1); }}
        >
          <option value="">كل الحالات</option>
          <option value="مفتوحة">مفتوحة</option>
          <option value="مغلقة جزئيًا">مغلقة جزئيًا</option>
          <option value="مغلقة">مغلقة</option>
        </select>
        <select
          className="form-control"
          style={{ maxWidth: 140 }}
          value={filters.priority}
          onChange={e => { setFilters(f => ({ ...f, priority: e.target.value })); setPage(1); }}
        >
          <option value="">كل الأولويات</option>
          <option value="مرتفعة">مرتفعة</option>
          <option value="متوسطة">متوسطة</option>
          <option value="منخفضة">منخفضة</option>
        </select>
        <button
          className={`btn ${filters.overdue === 'true' ? 'btn-danger' : 'btn-secondary'} btn-sm`}
          onClick={() => { setFilters(f => ({ ...f, overdue: f.overdue === 'true' ? '' : 'true' })); setPage(1); }}
        >
          ⏰ المتأخرة فقط
        </button>
        {(filters.gap_status || filters.priority || filters.overdue || filters.search) && (
          <button
            className="btn btn-ghost btn-sm text-gray"
            onClick={() => { setFilters({ gap_status: '', priority: '', overdue: '', search: '' }); setPage(1); }}
          >
            ✕ مسح الفلاتر
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center" style={{ minHeight: 300 }}>
          <div className="spinner spinner-lg" />
        </div>
      ) : actions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔧</div>
            <div className="empty-state-title">لا توجد إجراءات تصحيحية</div>
            <div className="empty-state-desc">ستظهر الإجراءات التصحيحية هنا عند فتحها من الزيارات الميدانية أو تقييمات الجودة</div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>الكود المرجعي</th>
                  <th>المعهد</th>
                  <th>محور الفجوة</th>
                  <th>الأولوية</th>
                  <th>حالة الفجوة</th>
                  <th>الإنجاز</th>
                  <th>الموعد المستهدف</th>
                  <th>المسؤول</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => {
                  const overdue = isOverdue(action.targetCompletionDate, action.gapStatus);
                  return (
                    <tr key={action._id} style={overdue ? { background: 'rgba(239, 68, 68, 0.03)' } : {}}>
                      <td>
                        <div style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary-700)', fontSize: 'var(--font-size-xs)' }}>
                          {action.referenceCode}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--gray-800)', fontSize: 'var(--font-size-sm)' }}>
                          {action.instituteId?.name}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>
                          {action.instituteId?.instituteCode}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-gray">{action.gapAxis}</span>
                      </td>
                      <td>
                        <PriorityBadge priority={action.priority} />
                      </td>
                      <td>
                        <GapStatusBadge status={action.gapStatus} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                          <div className="progress-bar" style={{ flex: 1, height: 6 }}>
                            <div
                              className={`progress-fill ${action.completionPercentage >= 75 ? 'success' : action.completionPercentage >= 40 ? '' : 'danger'}`}
                              style={{ width: `${action.completionPercentage}%` }}
                            />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--gray-500)', minWidth: 30 }}>
                            {action.completionPercentage}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: overdue ? 'var(--danger-600)' : 'var(--gray-600)',
                          fontWeight: overdue ? '700' : '400',
                        }}>
                          {overdue && '⚠️ '}
                          {new Date(action.targetCompletionDate).toLocaleDateString('ar-EG')}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-600)' }}>
                          {action.responsiblePersonName}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <a href={`/dashboard/corrective-actions/${action._id}`} className="btn btn-primary btn-sm">
                            عرض
                          </a>
                          {action.gapStatus !== 'مغلقة' && (
                            <a href={`/dashboard/corrective-actions/${action._id}/update`} className="btn btn-secondary btn-sm">
                              تحديث
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer">
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ←
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button
                      key={p}
                      className={`pagination-btn ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  →
                </button>
              </div>
              <div className="text-center text-xs text-muted">
                عرض {Math.min((page - 1) * 15 + 1, total)}-{Math.min(page * 15, total)} من {total.toLocaleString('ar-EG')} إجراء
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
