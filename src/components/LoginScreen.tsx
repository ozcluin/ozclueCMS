'use client';

import { useState } from 'react';
import { loginAdmin } from '@/app/actions';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        window.location.reload();
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Decorative blurred blobs for premium background */}
      <div className="login-blob login-blob-1" aria-hidden="true" />
      <div className="login-blob login-blob-2" aria-hidden="true" />

      <div className="login-glass-card">
        <div className="login-header">
          <div className="login-badge">
            <svg width="28" height="28" viewBox="0 0 50 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="14" r="11" fill="none" stroke="var(--gold)" strokeWidth="3.6" />
              <path d="M12 9 Q14 4, 19 5" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
              <path d="M27 22 L40 22 L27 36 L40 36" fill="none" stroke="var(--gold)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <h1 className="login-logo">
            OzClu <span style={{ color: 'var(--primary)' }}>CMS</span>
          </h1>
          <p className="login-subtitle">Screening Operations Control</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error-alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="login-group">
            <label className="login-label" htmlFor="email">Administrative Email</label>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. pkumar@cluso.in"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-group">
            <label className="login-label" htmlFor="password">Security Password</label>
            <div className="login-input-wrapper">
              <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <span className="login-btn-content">
                <svg className="login-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
                </svg>
                Authenticating Operations...
              </span>
            ) : (
              'Access Operations Dashboard'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <span>Protected by multi-source biometric compliance standards.</span>
        </div>
      </div>
    </div>
  );
}
