import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const AtIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2" />
    <circle cx="12" cy="16" r="1" fill="white" />
  </svg>
);

const FingerprintIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M12 10a2 2 0 00-2 2c0 1.02.5 1.92 1.26 2.46" />
    <path d="M17.32 6.68A7 7 0 005 12" />
    <path d="M20.93 12c0 5.52-5 10-9 12" />
    <path d="M7.06 17.32A7 7 0 0019 12" />
    <path d="M12 22c0-2.34 0-4-2-6" />
  </svg>
);

const SsoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const username = email.includes('@') ? email.split('@')[0] : email;
    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div
      className="login-page"
      data-theme={darkMode ? 'dark' : undefined}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: darkMode
          ? 'linear-gradient(160deg, #0f0e1a 0%, #13121f 100%)'
          : 'linear-gradient(160deg, #f1f0f8 0%, #e8e6f5 100%)',
      }}
    >
      <div className="login-brand" style={{ textAlign: 'center', marginBottom: 28, zIndex: 1 }}>
        <div
          className="login-logo-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            background: 'var(--bg-secondary)',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            marginBottom: 16,
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 220 220" fill="none">
            {/* User */}
            <circle cx="85" cy="85" r="18" fill="var(--primary-600)" />
            <path
              d="M55 130C55 115 70 105 85 105C100 105 115 115 115 130V135H55V130Z"
              fill="var(--primary-600)"
            />

            {/* Bars */}
            <rect x="120" y="110" width="10" height="25" rx="2" fill="var(--text-tertiary)" />
            <rect x="135" y="95" width="10" height="40" rx="2" fill="var(--primary-600)" />
            <rect x="150" y="80" width="10" height="55" rx="2" fill="var(--success-dot)" />

            {/* Line */}
            <polyline
              points="120,100 140,85 155,70"
              fill="none"
              stroke="var(--indigo-600)"
              strokeWidth="2"
            />
            <circle cx="120" cy="100" r="3" fill="var(--indigo-600)" />
            <circle cx="140" cy="85" r="3" fill="var(--indigo-600)" />
            <circle cx="155" cy="70" r="3" fill="var(--indigo-600)" />

            {/* Clock */}
            <circle
              cx="150"
              cy="140"
              r="14"
              fill="var(--bg-primary)"
              stroke="var(--border)"
              strokeWidth="2"
            />
            <path
              d="M150 132V140L155 143"
              stroke="var(--text-primary)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <span>User Activity</span>
        </div>
        <p
          className="login-subtitle"
          style={{ fontSize: '.9375rem', color: 'var(--text-secondary)' }}
        >
          Security Compliance & Infrastructure
          <br />
          Monitoring System
        </p>
      </div>

      <div
        className="login-card"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 24,
          padding: '28px 24px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          zIndex: 1,
        }}
      >
        <h2
          className="login-card-title"
          style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}
        >
          Welcome back
        </h2>
        <p
          className="login-card-sub"
          style={{ fontSize: '.875rem', color: 'var(--text-secondary)', marginBottom: 24 }}
        >
          Please enter your credentials to access the console.
        </p>

        {error && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '10px 12px',
              borderRadius: 10,
              fontSize: '.875rem',
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label
              className="input-label"
              style={{
                fontSize: '.8125rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 6,
              }}
            >
              Email Address
            </label>
            <div className="input-icon-wrap" style={{ position: 'relative' }}>
              <span
                className="field-icon"
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                }}
              >
                <AtIcon />
              </span>
              <input
                type="text"
                className="input-field"
                placeholder="admin@enterprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: 'var(--bg-input)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 12,
                  fontSize: '.875rem',
                }}
              />
            </div>
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label
                className="input-label"
                style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <button
                type="button"
                style={{
                  fontSize: '.8125rem',
                  color: 'var(--indigo-600)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </button>
            </div>
            <div className="input-icon-wrap" style={{ position: 'relative' }}>
              <span
                className="field-icon"
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                }}
              >
                <LockIcon />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: 'var(--bg-input)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 12,
                  fontSize: '.875rem',
                }}
              />
              <button
                type="button"
                className="field-icon-right"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div
            className="notice"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              background: '#eef2ff',
              border: '1px solid #e0e7ff',
              fontSize: '.8125rem',
              color: '#4f46e5',
            }}
          >
            <InfoIcon /> <span>Multi-factor authentication may be required.</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {loading ? 'Signing in…' : 'Secure Login'} {!loading && <ArrowRightIcon />}
          </button>
        </form>
      </div>

      <div
        className="login-footer"
        style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}
      >
        <a
          href="#"
          style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}
        >
          Privacy Policy
        </a>
        <a
          href="#"
          style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}
        >
          Terms of Service
        </a>
        <a
          href="#"
          style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}
        >
          Support
        </a>
      </div>

      <div
        className="login-status"
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '.6875rem',
          color: 'var(--text-tertiary)',
        }}
      >
        <div
          className="login-status-dot"
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}
        ></div>
        All Systems Operational
      </div>
    </div>
  );
};

export default LoginPage;
