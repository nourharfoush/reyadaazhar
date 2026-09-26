'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || 'بيانات الدخول غير صحيحة');
        return;
      }

      // Redirect based on role
      const role = data.data?.role;
      if (role === 'institute_manager') router.push('/dashboard/institute');
      else if (role === 'administration_supervisor') router.push('/dashboard/administration');
      else if (role === 'region_manager') router.push('/dashboard/region');
      else router.push('/portal');

    } catch {
      setError('حدث خطأ في الاتصال. يرجى المحاولة مجدداً.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🏃</div>
          <h1 className="login-title" style={{ fontSize: '20px', marginBottom: '8px' }}>منظومة متابعة انشطة التربية الرياضية</h1>
          <p className="login-subtitle">بالأزهر الشريف</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label required" htmlFor="username">
              اسم المستخدم أو البريد
            </label>
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="مثال: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              disabled={loading}
              dir="ltr"
              style={{ textAlign: 'right' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label required" htmlFor="password">
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                dir="ltr"
                style={{ textAlign: 'right', paddingLeft: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--gray-400)',
                  fontSize: '16px',
                }}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div style={{
            background: 'var(--gray-50)',
            padding: '12px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--gray-600)',
            lineHeight: '1.6'
          }}>
            🔑 <strong>بيانات الدخول الافتراضية للمدير:</strong><br />
            اسم المستخدم: <code style={{ color: 'var(--primary-700)', fontWeight: 'bold' }}>admin</code><br />
            كلمة المرور: <code style={{ color: 'var(--primary-700)', fontWeight: 'bold' }}>admin123</code>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <span>←</span>
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--gray-100)',
          textAlign: 'center',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--gray-400)',
        }}>
          <p>من تنفيذ النشاط إلى بناء الإنسان...</p>
          <p>ومن قياس الأداء إلى صناعة الأثر.</p>
        </div>
      </div>
    </div>
  );
}
