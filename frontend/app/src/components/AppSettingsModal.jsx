import React, { useState } from 'react';
import {
  XMarkIcon,
  PencilIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

const AppSettingsModal = ({ app, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: app?.name || '',
    description: app?.description || '',
  });
  const [showFullApiKey, setShowFullApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  if (!isOpen || !app) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call to update app would go here
      // await appsAPI.update(app.id, formData);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call
      alert('Settings saved successfully!');
      onUpdate?.(formData);
      onClose();
    } catch (error) {
      alert('Failed to save settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    try {
      // API call to regenerate API key would go here
      // await appsAPI.regenerateApiKey(app.id);
      alert('API key regenerated successfully! New key will be shown once.');
      setShowRegenerateConfirm(false);
    } catch (error) {
      alert('Failed to regenerate API key', error);
    }
  };

  const handleCopyApiKey = () => {
    const apiKeyToCopy = app.api_key_full || app.api_key_prefix;
    if (apiKeyToCopy) {
      navigator.clipboard?.writeText(apiKeyToCopy);
      alert('API key copied to clipboard!');
    }
  };

  const getAppIcon = () => {
    const name = (app.name || '').toLowerCase();
    if (name.includes('doc')) return '📄';
    if (name.includes('auth')) return '🔐';
    if (name.includes('web')) return '🌐';
    if (name.includes('analytics')) return '📊';
    if (name.includes('storage')) return '💾';
    return '📱';
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'center' }}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '550px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getAppIcon()}</span>
            <div>
              <span className="modal-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {app.name}
              </span>
              <p className="text-sm text-tertiary">Application Settings</p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Basic Information Section */}
          <div className="detail-section">
            <div className="detail-section-title">
              <PencilIcon className="h-4 w-4" /> Basic Information
            </div>

            <div className="input-group" style={{ marginBottom: 12 }}>
              <label className="input-label">App Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Application name"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea
                className="input-field"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Application description"
              />
            </div>
          </div>

          {/* API Key Section */}
          <div className="detail-section">
            <div className="detail-section-title">
              <KeyIcon className="h-4 w-4" /> API Key
            </div>

            <div className="app-meta-row" style={{ marginBottom: 8 }}>
              <span className="detail-key">App ID</span>
              <span className="detail-val font-mono">{app.id}</span>
            </div>

            <div className="app-meta-row" style={{ marginBottom: 8 }}>
              <span className="detail-key">API Key</span>
              <div className="flex items-center gap-2">
                <span className="detail-val font-mono">
                  {showFullApiKey
                    ? app.api_key_full || app.api_key_prefix + '••••••••'
                    : (app.api_key_prefix || '••••••••') + '••••••••••••'}
                </span>
                <button
                  className="icon-btn btn-sm"
                  onClick={() => setShowFullApiKey(!showFullApiKey)}
                  title={showFullApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showFullApiKey ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
                <button className="icon-btn btn-sm" onClick={handleCopyApiKey} title="Copy API key">
                  📋
                </button>
              </div>
            </div>

            <button
              className="btn btn-outline btn-sm"
              style={{ marginTop: 8, width: '100%' }}
              onClick={() => setShowRegenerateConfirm(true)}
            >
              Regenerate API Key
            </button>
          </div>

          {/* Status Section */}
          <div className="detail-section">
            <div className="detail-section-title">
              <ShieldCheckIcon className="h-4 w-4" /> Status & Security
            </div>

            <div className="app-meta-row">
              <span className="detail-key">Status</span>
              <span className={`badge ${app.is_active ? 'tag-success' : 'tag-default'}`}>
                {app.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="app-meta-row">
              <span className="detail-key">Created</span>
              <span className="detail-val">{new Date(app.created_at).toLocaleDateString()}</span>
            </div>

            <div className="app-meta-row">
              <span className="detail-key">Last Updated</span>
              <span className="detail-val">
                {app.updated_at ? new Date(app.updated_at).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="detail-section"
            style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}
          >
            <div className="detail-section-title" style={{ color: '#ef4444' }}>
              ⚠️ Danger Zone
            </div>
            <p className="text-sm text-secondary" style={{ marginBottom: 12 }}>
              Once you delete this application, all associated events will be permanently removed.
            </p>
            <button
              className="btn btn-danger btn-sm"
              style={{ width: '100%' }}
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to delete "${app.name}"? This action cannot be undone.`,
                  )
                ) {
                  alert('Delete functionality would go here');
                }
              }}
            >
              Delete Application
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Regenerate API Key Confirmation Modal */}
      {showRegenerateConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowRegenerateConfirm(false)}
          style={{ alignItems: 'center', zIndex: 1001 }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px', width: '90%' }}
          >
            <div className="modal-header">
              <span className="modal-title">⚠️ Regenerate API Key</span>
              <button className="icon-btn" onClick={() => setShowRegenerateConfirm(false)}>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to regenerate the API key for <strong>{app.name}</strong>?
              </p>
              <p className="text-danger" style={{ marginTop: 12, fontSize: '.8125rem' }}>
                This will invalidate the current API key immediately. Any applications using the old
                key will stop working until updated.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowRegenerateConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleRegenerateApiKey}>
                Regenerate Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSettingsModal;
