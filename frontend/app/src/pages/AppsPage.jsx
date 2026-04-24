import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../components/Layout';
import Portal from '../components/Portal';
import { appsAPI } from '../services/api';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CogIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l-.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CHART_DATA = [35, 42, 38, 55, 48, 62, 58, 70, 65, 45, 52, 68, 75, 40, 38, 55];

const MiniBarChart = () => {
  const max = Math.max(...CHART_DATA);
  const peakIdx = CHART_DATA.indexOf(max);
  return (
    <div className="activity-bar-chart" style={{ height: 48 }}>
      {CHART_DATA.map((height, i) => (
        <div
          key={i}
          className={`bar-segment ${i === peakIdx ? 'active' : ''}`}
          style={{ height: `${Math.max(10, (height / max) * 100)}%` }}
        />
      ))}
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalWidth = size === 'small' ? '400px' : '500px';
  const hideScrollbarStyles = {
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  return (
    <Portal>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-primary, #ffffff)',
            borderRadius: '24px',
            maxWidth: modalWidth,
            width: '90%',
            maxHeight: '85vh',
            ...hideScrollbarStyles,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'modalSlideIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{title}</h3>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <XIcon />
            </button>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
};

// Settings Modal Component
const SettingsModal = ({ app, isOpen, onClose, onUpdate, onRegenerateKey }) => {
  const [formData, setFormData] = useState({
    name: app?.name || '',
    description: app?.description || '',
    is_active: app?.is_active ?? true,
  });
  const [showFullApiKey, setShowFullApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update form data when app prop changes
  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name || '',
        description: app.description || '',
        is_active: app.is_active ?? true,
      });
    }
  }, [app]);

  if (!isOpen || !app) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await appsAPI.update(app.id, formData);
      setSaveSuccess(true);
      if (onUpdate) onUpdate(formData);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyApiKey = () => {
    const keyToCopy = app.api_key_full || app.api_key_prefix;
    if (keyToCopy) {
      navigator.clipboard?.writeText(keyToCopy);
      alert('API key copied to clipboard!');
    }
  };

  const handleRegenerateClick = () => {
    if (onRegenerateKey) {
      onRegenerateKey(app.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Application Settings" size="medium">
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Basic Information */}
        <div>
          <h4
            style={{
              fontSize: '.8125rem',
              fontWeight: 600,
              marginBottom: 16,
              color: 'var(--text-secondary)',
            }}
          >
            Basic Information
          </h4>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: 'block', marginBottom: 6, fontSize: '.875rem', fontWeight: 500 }}
            >
              Application Name
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label
              style={{ display: 'block', marginBottom: 6, fontSize: '.875rem', fontWeight: 500 }}
            >
              Description
            </label>
            <textarea
              className="input-field"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <label
              htmlFor="is_active"
              style={{ fontSize: '.875rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Application is Active
            </label>
          </div>
        </div>

        {/* API Key Section */}
        <div>
          <h4
            style={{
              fontSize: '.8125rem',
              fontWeight: 600,
              marginBottom: 16,
              color: 'var(--text-secondary)',
            }}
          >
            API Key
          </h4>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--bg-tertiary)',
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              marginBottom: 12,
            }}
          >
            <code style={{ flex: 1, fontFamily: 'monospace', fontSize: '.75rem' }}>
              {showFullApiKey
                ? app.api_key_full || app.api_key_prefix + '••••••••'
                : (app.api_key_prefix || '••••••••') + '••••••••••••'}
            </code>
            <button
              onClick={() => setShowFullApiKey(!showFullApiKey)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showFullApiKey ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            <button
              onClick={handleCopyApiKey}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <CopyIcon />
            </button>
          </div>
          <button
            className="btn btn-outline"
            onClick={handleRegenerateClick}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            🔄 Regenerate API Key
          </button>
        </div>

        {/* Metadata */}
        <div>
          <h4
            style={{
              fontSize: '.8125rem',
              fontWeight: 600,
              marginBottom: 16,
              color: 'var(--text-secondary)',
            }}
          >
            Application Metadata
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '.8125rem', color: 'var(--text-secondary)' }}>App ID</span>
              <code style={{ fontSize: '.75rem' }}>{app.id}</code>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '.8125rem', color: 'var(--text-secondary)' }}>Created</span>
              <span>{new Date(app.created_at).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontSize: '.8125rem', color: 'var(--text-secondary)' }}>Status</span>
              <span className={`badge ${app.is_active ? 'tag-success' : 'tag-default'}`}>
                {app.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
        }}
      >
        {saveSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#10b981',
              marginRight: 'auto',
            }}
          >
            <CheckIcon /> Saved!
          </div>
        )}
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </Modal>
  );
};

// Regenerate Key Modal
const RegenerateKeyModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regenerate API Key" size="small">
      <div style={{ padding: '24px' }}>
        <p style={{ marginBottom: 16 }}>Are you sure you want to regenerate the API key?</p>
        <p style={{ fontSize: '.8125rem', color: '#ef4444', marginBottom: 24 }}>
          This action cannot be undone. The old API key will stop working immediately.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Regenerate Key
          </button>
        </div>
      </div>
    </Modal>
  );
};

// New API Key Display Modal
const NewApiKeyModal = ({ isOpen, onClose, apiKey }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !apiKey) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔑 New API Key Generated" size="small">
      <div style={{ padding: '24px' }}>
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <p style={{ fontWeight: 600, color: '#065f46', marginBottom: 12 }}>
            Save this key immediately — it won't be shown again.
          </p>
          <code
            style={{
              display: 'block',
              background: '#fff',
              padding: 12,
              borderRadius: 8,
              wordBreak: 'break-all',
              marginBottom: 12,
              border: '1px solid #d1fae5',
              fontSize: '.7rem',
            }}
          >
            {apiKey}
          </code>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <CopyIcon /> {copied ? 'Copied!' : 'Copy Key'}
          </button>
        </div>
      </div>
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button className="btn btn-primary" onClick={onClose}>
          I've Saved It
        </button>
      </div>
    </Modal>
  );
};

const AppsPage = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppData, setNewAppData] = useState({ id: '', name: '', description: '' });
  const [generatedApiKey, setGeneratedApiKey] = useState(null);
  const [appToDelete, setAppToDelete] = useState(null);
  const [isKeyCopied, setIsKeyCopied] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState(null);
  const [appToRegenerate, setAppToRegenerate] = useState(null);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const response = await appsAPI.getAll();
      setApps(response.data.apps || []);
    } catch (error) {
      console.error('Failed to fetch apps:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleCreateApp = async (e) => {
    e.preventDefault();
    try {
      const response = await appsAPI.create(newAppData);
      setGeneratedApiKey(response.data.app.api_key);
      await fetchApps();
      setShowCreateModal(false);
      setNewAppData({ id: '', name: '', description: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create app');
    }
  };

  const handleDeleteApp = async (appId) => {
    try {
      await appsAPI.delete(appId);
      await fetchApps();
      setAppToDelete(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete app');
    }
  };

  const handleCopyApiKey = (key) => {
    navigator.clipboard?.writeText(key);
    setIsKeyCopied(true);
    setTimeout(() => setIsKeyCopied(false), 2000);
  };

  const handleRegenerateKey = async () => {
    try {
      const response = await appsAPI.regenerateKey(appToRegenerate);
      setNewApiKey(response.data.api_key);
      setShowRegenerateModal(false);
      await fetchApps();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to regenerate API key');
    }
  };

  const openRegenerateModal = (appId) => {
    setAppToRegenerate(appId);
    setShowRegenerateModal(true);
  };

  const handleUpdateApp = async (updatedData) => {
    setApps((prevApps) =>
      prevApps.map((app) => (app.id === selectedApp?.id ? { ...app, ...updatedData } : app)),
    );
    // Also update selectedApp to keep the modal in sync
    setSelectedApp((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const filteredApps = apps.filter((app) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (app.name || '').toLowerCase().includes(query) || (app.id || '').toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="animate-fade-in-up">
        <div style={{ marginBottom: 14 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Applications</h1>
          <p style={{ fontSize: '.875rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Manage integrated services and API keys
          </p>
        </div>

        <div className="card section-sm">
          <div className="card-body" style={{ paddingBottom: 10 }}>
            <MiniBarChart />
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ marginBottom: 12, gap: 8 }}
          onClick={() => setShowCreateModal(true)}
        >
          <PlusIcon /> Create New App
        </button>

        <div className="search-bar-wrapper section-sm" style={{ position: 'relative' }}>
          <span
            className="search-bar-icon"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
            }}
          >
            <SearchIcon />
          </span>
          <input
            type="search"
            className="search-bar-input"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}
          />
        </div>

        <button
          className="btn btn-secondary"
          style={{ marginBottom: 12, width: '100%', gap: 8 }}
          onClick={() => fetchApps()}
        >
          <RefreshIcon /> Refresh Apps
        </button>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="app-card">
              <div className="skeleton" style={{ height: 90 }} />
            </div>
          ))
        ) : filteredApps.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📱</div>
              <div className="empty-title">No applications yet</div>
              <div className="empty-desc">Create your first app to start logging events</div>
              <button
                className="btn btn-primary"
                style={{ marginTop: 12 }}
                onClick={() => setShowCreateModal(true)}
              >
                Create Application
              </button>
            </div>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="app-card"
              style={{
                background: 'var(--bg-primary)',
                borderRadius: 16,
                border: '1px solid var(--border)',
                padding: 16,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: '#eef2ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4f46e5',
                    flexShrink: 0,
                  }}
                >
                  📊
                </div>
                <div style={{ flex: 1 }}>
                  <div className="app-name" style={{ fontSize: '.9375rem', fontWeight: 600 }}>
                    {app.name}
                  </div>
                  <div
                    className="app-status"
                    style={{
                      fontSize: '.6875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: app.is_active ? '#10b981' : '#9ca3af',
                      }}
                    ></span>
                    {app.is_active ? 'Active' : 'Inactive'}
                  </div>
                  {app.description && (
                    <div
                      style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}
                    >
                      {app.description}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div
                  className="app-meta-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '.75rem',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>App ID</span>
                  <span style={{ fontFamily: 'monospace' }}>{app.id}</span>
                </div>
                <div
                  className="app-meta-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    fontSize: '.75rem',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>API Key Prefix</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'monospace' }}>
                      {app.api_key_prefix || '••••••••'}
                    </span>
                    {app.api_key_prefix && (
                      <button
                        onClick={() => handleCopyApiKey(app.api_key_prefix)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        <CopyIcon />
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className="app-meta-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    fontSize: '.75rem',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>Created</span>
                  <span>
                    {app.created_at ? new Date(app.created_at).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
              <div className="app-actions" style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => {
                    setSelectedApp(app);
                    setShowSettingsModal(true);
                  }}
                >
                  <CogIcon /> Settings
                </button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                  onClick={() => setAppToDelete(app.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {apps.length > 0 && (
          <div style={{ textAlign: 'center', margin: '12px 0' }}>
            <p style={{ fontSize: '.8125rem', color: 'var(--text-secondary)' }}>
              Showing {filteredApps.length} of {apps.length} registered applications
            </p>
          </div>
        )}
      </div>

      {/* Create App Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Application"
      >
        <form onSubmit={handleCreateApp}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label
                style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 6, display: 'block' }}
              >
                App ID *
              </label>
              <input
                type="text"
                placeholder="e.g., myapp"
                value={newAppData.id}
                onChange={(e) =>
                  setNewAppData({
                    ...newAppData,
                    id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                  })
                }
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-input)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 12,
                }}
              />
              <span
                style={{
                  fontSize: '.7rem',
                  color: 'var(--text-tertiary)',
                  marginTop: 4,
                  display: 'block',
                }}
              >
                Lowercase letters, numbers, underscores only
              </span>
            </div>
            <div>
              <label
                style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 6, display: 'block' }}
              >
                App Name *
              </label>
              <input
                type="text"
                placeholder="My Application"
                value={newAppData.name}
                onChange={(e) => setNewAppData({ ...newAppData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-input)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 12,
                }}
              />
            </div>
            <div>
              <label
                style={{ fontSize: '.8125rem', fontWeight: 600, marginBottom: 6, display: 'block' }}
              >
                Description
              </label>
              <textarea
                rows="3"
                placeholder="Describe what this app does"
                value={newAppData.description}
                onChange={(e) => setNewAppData({ ...newAppData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-input)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 12,
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCreateModal(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Create App
            </button>
          </div>
        </form>
      </Modal>

      {/* API Key Generated Modal */}
      <Modal
        isOpen={!!generatedApiKey}
        onClose={() => setGeneratedApiKey(null)}
        title="🔑 API Key Generated"
        size="small"
      >
        <div style={{ padding: '20px 24px' }}>
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <p
              style={{ fontSize: '.8125rem', fontWeight: 600, color: '#065f46', marginBottom: 12 }}
            >
              Save this key immediately — it won't be shown again.
            </p>
            <div
              style={{
                background: '#fff',
                borderRadius: 8,
                padding: 12,
                fontFamily: 'monospace',
                fontSize: '.75rem',
                wordBreak: 'break-all',
                marginBottom: 12,
                border: '1px solid #d1fae5',
              }}
            >
              {generatedApiKey}
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleCopyApiKey(generatedApiKey)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CopyIcon /> {isKeyCopied ? 'Copied!' : 'Copy Key'}
            </button>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <button className="btn btn-primary" onClick={() => setGeneratedApiKey(null)}>
            I've Saved It
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!appToDelete}
        onClose={() => setAppToDelete(null)}
        title="Delete Application"
        size="small"
      >
        <div style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: '.875rem', marginBottom: 12 }}>
            Are you sure you want to delete this application?
          </p>
          <p style={{ fontSize: '.8125rem', color: '#ef4444' }}>
            This action cannot be undone. All associated events will be deleted.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => setAppToDelete(null)}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteApp(appToDelete)}
            style={{ flex: 1 }}
          >
            Delete Permanently
          </button>
        </div>
      </Modal>

      {/* Settings Modal */}
      <SettingsModal
        app={selectedApp}
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          setSelectedApp(null);
        }}
        onUpdate={handleUpdateApp}
        onRegenerateKey={openRegenerateModal}
      />

      {/* Regenerate Key Confirmation */}
      <RegenerateKeyModal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        onConfirm={handleRegenerateKey}
      />

      {/* New API Key Display */}
      <NewApiKeyModal
        isOpen={!!newApiKey}
        onClose={() => {
          setNewApiKey(null);
          fetchApps();
        }}
        apiKey={newApiKey}
      />
    </Layout>
  );
};

export default AppsPage;
