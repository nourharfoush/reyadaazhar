'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles?: string[];
  badgeKey?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard/institute', label: 'لوحة المعهد', icon: '🏫', roles: ['institute_manager'] },
  { href: '/dashboard/administration', label: 'لوحة الإدارة', icon: '🏢', roles: ['administration_supervisor'] },
  { href: '/dashboard/region', label: 'لوحة المنطقة', icon: '🗺', roles: ['region_manager'] },
  { href: '/dashboard/general', label: 'اللوحة العامة', icon: '📊', roles: ['general_admin', 'system_admin'] },
  { href: '/dashboard/plans', label: 'خطط التنفيذ', icon: '📋' },
  { href: '/dashboard/field-visits', label: 'الزيارات الميدانية', icon: '🔍' },
  { href: '/dashboard/quality', label: 'تقييم الجودة', icon: '⭐' },
  { href: '/dashboard/corrective-actions', label: 'الإجراءات التصحيحية', icon: '🔧', badgeKey: 'openActions' },
  { href: '/dashboard/students', label: 'الطلاب والقياسات', icon: '🎯' },
  { href: '/dashboard/capacity', label: 'بناء القدرات', icon: '💪' },
  { href: '/dashboard/reports', label: 'التقارير', icon: '📄' },
  { href: '/dashboard/institutes', label: 'المعاهد', icon: '🏫', roles: ['administration_supervisor', 'region_manager', 'general_admin', 'system_admin'] },
  { href: '/dashboard/users', label: 'المستخدمون', icon: '👥', roles: ['general_admin', 'system_admin'] },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: '⚙️', roles: ['general_admin', 'system_admin'] },
];

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    // Load current user from /api/me
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));

    // Load notification count
    fetch('/api/notifications/count')
      .then((r) => r.json())
      .then((data) => { if (data.success) setNotifications(data.data.unread); })
      .catch(() => {});
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const roleLabel: Record<string, string> = {
    institute_manager: 'مسؤول المشروع بالمعهد',
    administration_supervisor: 'مسؤول المتابعة بالإدارة',
    region_manager: 'مسؤول المنطقة الأزهرية',
    general_admin: 'الإدارة العامة للمشروع',
    system_admin: 'مدير النظام',
  };

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-app)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--gray-500)', fontSize: 'var(--font-size-sm)' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const currentTitle = visibleNavItems.find((i) => pathname.startsWith(i.href))?.label || 'لوحة التحكم';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏃</div>
          <div className="sidebar-logo-text" style={{ fontSize: '13px' }}>
            منظومة متابعة انشطة التربية الرياضية
            <small>بالازهر الشريف</small>
          </div>
        </div>

        <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => { router.push('/portal'); setSidebarOpen(false); }}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--primary-200)',
              background: 'var(--primary-50)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
          >
            <span>🏠</span>
            <span>العودة للكاردات الرئيسية</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">القائمة الرئيسية</div>
          {visibleNavItems.map((item) => (
            <button
              key={item.href}
              className={`nav-item ${pathname.startsWith(item.href) ? 'active' : ''}`}
              onClick={() => { router.push(item.href); setSidebarOpen(false); }}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badgeKey === 'openActions' && notifications > 0 && (
                <span className="nav-badge">{notifications}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="nav-item"
            onClick={handleLogout}
            style={{ borderRadius: 'var(--border-radius-sm)', width: '100%' }}
          >
            <span className="nav-item-icon">🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
              aria-label="فتح القائمة"
              id="sidebar-toggle"
            >
              ☰
            </button>
            <h1 className="topbar-title">{currentTitle}</h1>
          </div>

          <div className="topbar-actions">
            {/* Notifications */}
            <button
              className="notif-btn"
              onClick={() => router.push('/dashboard/notifications')}
              aria-label="الإشعارات"
            >
              🔔
              {notifications > 0 && (
                <span className="notif-badge">{notifications > 99 ? '99+' : notifications}</span>
              )}
            </button>

            {/* User info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              background: 'var(--gray-50)',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--gray-200)',
              cursor: 'default',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '700',
                fontSize: 'var(--font-size-sm)',
                flexShrink: 0,
              }}>
                {user?.name?.charAt(0) || '؟'}
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--gray-800)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>
                  {user ? roleLabel[user.role] : ''}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="page-content">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
            display: 'none',
          }}
        />
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          #sidebar-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
