'use client';
import { useState, FormEvent } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🔐</div>
          <h1 className="login-title">استعادة كلمة المرور</h1>
          <p className="login-subtitle">أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة</p>
        </div>

        {sent ? (
          <div>
            <div className="alert alert-success">
              <span>✅</span>
              <span>تم إرسال رابط الاستعادة إلى <strong>{email}</strong>. تحقق من بريدك الإلكتروني.</span>
            </div>
            <a href="/login" className="btn btn-primary btn-block mt-4">العودة لتسجيل الدخول</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label required" htmlFor="email">البريد الإلكتروني</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="example@azhar.edu.eg"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading || !email}>
              {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <a href="/login" className="text-sm text-primary">← العودة لتسجيل الدخول</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
