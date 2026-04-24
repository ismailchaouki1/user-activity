import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { eventsAPI } from '../services/api';

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

const CHART_DATA = [25, 42, 38, 55, 48, 62, 58, 70, 65, 80, 72, 68, 75, 85, 78, 82, 88, 92];

const getActionClass = (action = '') => {
  const a = (action || '').toLowerCase();
  if (a.includes('login')) return 'tag-login';
  if (a.includes('logout')) return 'tag-logout';
  if (a.includes('create')) return 'tag-create';
  if (a.includes('edit') || a.includes('update')) return 'tag-edit';
  if (a.includes('delete')) return 'tag-delete';
  return 'tag-default';
};

const getRelativeTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  } catch (e) {
    return e;
  }
};

const MiniBarChart = () => {
  const max = Math.max(...CHART_DATA);
  return (
    <div className="activity-bar-chart" style={{ height: 56 }}>
      {CHART_DATA.map((height, i) => {
        const isActive = i === CHART_DATA.length - 3 || i === CHART_DATA.length - 2;
        return (
          <div
            key={i}
            className={`bar-segment ${isActive ? 'active' : ''}`}
            style={{ height: `${Math.max(10, (height / max) * 100)}%` }}
          />
        );
      })}
    </div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (searchQuery) params.search = searchQuery;
      const response = await eventsAPI.getAll(params);
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <Layout>
      <div className="animate-fade-in-up">
        <div className="card section-sm">
          <div className="card-body" style={{ paddingBottom: 8 }}>
            <div className="section-header" style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: '.9375rem' }}>Activity Spikes</span>
              <span style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>Last 24h</span>
            </div>
            <MiniBarChart />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '10px 0' }}>
          <div className="search-bar-wrapper" style={{ flex: 1, position: 'relative' }}>
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
              placeholder="Search events... (Press '/' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: '.875rem',
              }}
            />
            <span
              className="search-kbd"
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--bg-tertiary)',
                padding: '2px 6px',
                borderRadius: 6,
                fontSize: '.625rem',
                color: 'var(--text-tertiary)',
              }}
            >
              /
            </span>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => fetchEvents()}
            style={{
              width: 42,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RefreshIcon />
          </button>
        </div>

        {loading && events.length === 0 ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="event-card">
              <div className="skeleton" style={{ height: 80 }} />
            </div>
          ))
        ) : events.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-title">No events found</div>
              <div className="empty-desc">Try adjusting your filters or send some events</div>
            </div>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-card-top">
                <div className="event-user-row">
                  <div className="event-avatar" style={{ fontSize: '1rem' }}>
                    ●
                  </div>
                  <div>
                    <div className="event-user-name">
                      {event.user_email || event.user_id || 'unknown_user'}
                    </div>
                    <div className="event-time">{getRelativeTime(event.created_at)}</div>
                  </div>
                </div>
                <span className={`tag ${getActionClass(event.action)}`}>
                  {event.action?.split('.').pop()?.replace(/_/g, ' ') || 'Event'}
                </span>
              </div>
              {(event.resource_type || event.resource_id) && (
                <p
                  className="event-description"
                  style={{ fontSize: '.8125rem', color: 'var(--text-secondary)', margin: '8px 0' }}
                >
                  {event.resource_type && (
                    <code
                      style={{
                        background: 'var(--bg-tertiary)',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {event.resource_type}
                    </code>
                  )}
                  {event.resource_id && (
                    <>
                      {' '}
                      →{' '}
                      <code
                        style={{
                          background: 'var(--bg-tertiary)',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        {event.resource_id}
                      </code>
                    </>
                  )}
                </p>
              )}
              <div
                className="event-card-bottom"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 8,
                  borderTop: '1px solid var(--border)',
                }}
              >
                <div
                  className="event-app-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '.75rem',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  <span>📱</span>
                  <span>{event.app_id || 'Unknown'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;
