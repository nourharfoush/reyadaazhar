'use client';

import { useRouter } from 'next/navigation';

export default function ReportsAndFollowupsPage() {
  const router = useRouter();

  const cards = [
    { 
      title: 'الخطة', 
      icon: '📝', 
      desc: 'الخطة العامة والتفصيلية للمشروع', 
      href: '/dashboard/reports/plan',
      color: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      borderColor: '#bbf7d0',
      iconBg: '#22c55e'
    },
    { 
      title: 'المتابعات والتقارير', 
      icon: '📊', 
      desc: 'تقارير الأداء والمتابعات الميدانية', 
      href: '/dashboard/reports/followups',
      color: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      borderColor: '#bfdbfe',
      iconBg: '#3b82f6'
    },
    { 
      title: 'الأخبار', 
      icon: '📰', 
      desc: 'أحدث الأخبار والتعميمات', 
      href: '/dashboard/reports/news',
      color: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      borderColor: '#fde68a',
      iconBg: '#f59e0b'
    },
    { 
      title: 'البرنامج الزمني', 
      icon: '⏳', 
      desc: 'الجدول الزمني للأنشطة والفعاليات', 
      href: '/dashboard/reports/timeline',
      color: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      borderColor: '#ddd6fe',
      iconBg: '#8b5cf6'
    }
  ];

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '800', color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
          التقارير والمتابعات الميدانية
        </h2>
        <p className="text-gray text-md">اختر القسم الذي ترغب في استعراضه</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        padding: '1rem'
      }}>
        {cards.map(c => (
          <div 
            key={c.title} 
            className="portal-card" 
            style={{ 
              background: c.color, 
              border: `1px solid ${c.borderColor}`,
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
            }}
            onClick={() => router.push(c.href)}
          >
            <div style={{ 
              background: c.iconBg, 
              color: 'white',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {c.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '0.75rem' }}>
              {c.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
              {c.desc}
            </p>
            <button 
              className="btn"
              style={{
                background: 'white',
                color: c.iconBg,
                border: `2px solid ${c.iconBg}`,
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                width: '100%',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = c.iconBg;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = c.iconBg;
              }}
            >
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
