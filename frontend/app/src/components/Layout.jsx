import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const LogsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

const AppsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <circle cx="5" cy="5" r="2" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/events': 'User Activity',
  '/apps': 'Applications',
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/events', label: 'User Activity', icon: <LogsIcon /> },
  { href: '/apps', label: 'Applications', icon: <AppsIcon /> },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = PAGE_TITLES[location.pathname] || 'Audit Log';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  return (
    <div className="app-wrapper">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="42" height="42" viewBox="0 0 220 220" fill="none">
                {/* User */}
                <circle cx="85" cy="85" r="18" fill="white" />
                <path
                  d="M55 130C55 115 70 105 85 105C100 105 115 115 115 130V135H55V130Z"
                  fill="white"
                  opacity="0.9"
                />

                {/* Bars */}
                <rect x="120" y="110" width="10" height="25" rx="2" fill="white" opacity="0.5" />
                <rect x="135" y="95" width="10" height="40" rx="2" fill="white" opacity="0.7" />
                <rect x="150" y="80" width="10" height="55" rx="2" fill="white" />

                {/* Line */}
                <polyline
                  points="120,100 140,85 155,70"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <circle cx="120" cy="100" r="2.5" fill="white" />
                <circle cx="140" cy="85" r="2.5" fill="white" />
                <circle cx="155" cy="70" r="2.5" fill="white" />

                {/* Clock */}
                <circle cx="150" cy="140" r="12" fill="white" opacity="0.15" />
                <path
                  d="M150 134V140L154 142"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="logo-text">
              <h1>User Activity</h1>
              <p>Security Console</p>
            </div>
          </div>
        </div>
        <nav className="nav-menu">
          {navItems.map(({ href, label, icon }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-icon">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{
              width: '100%',
              textAlign: 'left',
              color: 'var(--danger-dot)',
              border: 'none',
            }}
          >
            <span className="nav-icon">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 17L21 12M21 12L16 7M21 12H9M12 17C12 17.93 12 18.395 11.8978 18.7765C11.6204 19.8117 10.8117 20.6204 9.77646 20.8978C9.39496 21 8.92997 21 8 21H7.5C6.10218 21 5.40326 21 4.85195 20.7716C4.11687 20.4672 3.53284 19.8831 3.22836 19.1481C3 18.5967 3 17.8978 3 16.5V7.5C3 6.10217 3 5.40326 3.22836 4.85195C3.53284 4.11687 4.11687 3.53284 4.85195 3.22836C5.40326 3 6.10218 3 7.5 3H8C8.92997 3 9.39496 3 9.77646 3.10222C10.8117 3.37962 11.6204 4.18827 11.8978 5.22354C12 5.60504 12 6.07003 12 7"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </button>
          <span className="header-title">{pageTitle}</span>
          <div className="header-actions">
            <button className="header-icon-btn" onClick={toggleDarkMode}>
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <div className="header-avatar" title={user?.username}>
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        <div className="page-container animate-fade-in-up">{children}</div>
      </main>

      <nav className="bottom-nav">
        {navItems.map(({ href, label, icon }) => {
          const isActive = location.pathname === href;
          return (
            <Link key={href} to={href} className={`nav-item-bottom ${isActive ? 'active' : ''}`}>
              {icon}
              <span className="nav-label">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
