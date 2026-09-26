'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PortalPage() {
  const router = useRouter();

  return (
    <div className="portal-container">
      <div className="portal-header">
        <h1 className="portal-title">منظومة متابعة أنشطة التربية الرياضية</h1>
        <p className="portal-subtitle">بالأزهر الشريف</p>
      </div>

      <div className="portal-grid">
        {/* Card 1 */}
        <div className="portal-card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #bbf7d0' }}>
          <div className="portal-card-icon" style={{ background: '#22c55e', color: 'white' }}>🏃</div>
          <h2 className="portal-card-title">المشروع القومي للياقة البدنية</h2>
          <div className="portal-buttons">
            <button className="portal-btn primary-btn" onClick={() => router.push('/dashboard/general')}>
              <span>👨 بنين</span>
              <small>النظام الحالي</small>
            </button>
            <button className="portal-btn disabled-btn" disabled>
              <span>👩 فتيات</span>
              <small>قريباً</small>
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="portal-card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe' }}>
          <div className="portal-card-icon" style={{ background: '#3b82f6', color: 'white' }}>🏆</div>
          <h2 className="portal-card-title">المسابقات الرياضية</h2>
          <div className="portal-buttons">
            <button className="portal-btn disabled-btn" disabled>
              <span>👨 بنين</span>
              <small>قريباً</small>
            </button>
            <button className="portal-btn disabled-btn" disabled>
              <span>👩 فتيات</span>
              <small>قريباً</small>
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="portal-card" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fde68a' }}>
          <div className="portal-card-icon" style={{ background: '#f59e0b', color: 'white' }}>💰</div>
          <h2 className="portal-card-title">حساب دعم النشاط</h2>
          <div className="portal-buttons" style={{ gridTemplateColumns: '1fr' }}>
            <button className="portal-btn disabled-btn" disabled>
              <span>👨👩 بنين وفتيات (مجمع)</span>
              <small>قريباً</small>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .portal-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .portal-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .portal-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--gray-800);
          margin-bottom: 0.5rem;
        }
        .portal-subtitle {
          font-size: 1.1rem;
          color: var(--gray-500);
        }
        .portal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .portal-card {
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }
        .portal-card:hover {
          transform: translateY(-5px);
        }
        .portal-card-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .portal-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--gray-800);
          margin-bottom: 2rem;
        }
        .portal-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .portal-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .portal-btn span {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .portal-btn small {
          font-size: 0.8rem;
          opacity: 0.9;
        }
        .primary-btn {
          background: white;
          color: #15803d;
          border: 2px solid #22c55e;
        }
        .primary-btn:hover {
          background: #22c55e;
          color: white;
        }
        .disabled-btn {
          background: rgba(255,255,255,0.5);
          color: var(--gray-400);
          border: 1px dashed var(--gray-300);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
