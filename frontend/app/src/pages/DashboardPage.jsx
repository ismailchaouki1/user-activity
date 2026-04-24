import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ActivityChart from '../components/ActivityChart';
import { statsAPI, eventsAPI } from '../services/api';

const getActionClass = (action = '') => {
  const a = (action || '').toLowerCase();
  if (a.includes('login')) return 'tag-login';
  if (a.includes('logout')) return 'tag-logout';
  if (a.includes('create')) return 'tag-create';
  if (a.includes('edit') || a.includes('update')) return 'tag-edit';
  if (a.includes('delete')) return 'tag-delete';
  return 'tag-default';
};

const getAvatarEmoji = (action = '') => {
  const a = (action || '').toLowerCase();
  if (a.includes('login')) return '→';
  if (a.includes('logout')) return '↩';
  if (a.includes('create')) return '✚';
  if (a.includes('edit') || a.includes('update')) return '✎';
  if (a.includes('delete')) return '✕';
  return '●';
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

const EventsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BarChart = ({ data = [], height = 56 }) => {
  let chartData = data;
  if (!chartData || chartData.length === 0) {
    chartData = [
      { date: 'Mon', count: 12 },
      { date: 'Tue', count: 19 },
      { date: 'Wed', count: 15 },
      { date: 'Thu', count: 22 },
      { date: 'Fri', count: 28 },
      { date: 'Sat', count: 24 },
      { date: 'Sun', count: 31 },
    ];
  }
  const max = Math.max(...chartData.map((d) => d.count), 1);
  let peakIdx = 0;
  for (let i = 0; i < chartData.length; i++) {
    if (chartData[i].count > chartData[peakIdx].count) peakIdx = i;
  }
  return (
    <div className="activity-bar-chart" style={{ height }}>
      {chartData.map((d, i) => (
        <div
          key={i}
          className={`bar-segment ${i === peakIdx ? 'active' : ''}`}
          style={{ height: `${Math.max(10, (d.count / max) * 100)}%` }}
          title={`${d.date || ''}: ${d.count} events`}
        />
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total_events: 0,
    unique_users: 0,
    active_apps: 0,
    last_7_days: [],
    top_actions: [],
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sRes, eRes] = await Promise.all([
          statsAPI.getDashboard(),
          eventsAPI.getAll({ limit: 8 }),
        ]);
        setStats(sRes.data.stats || {});
        setRecentEvents(eRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="kpi-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="kpi-card">
              <div className="skeleton" style={{ height: 70, width: '100%' }} />
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-body">
            <div className="skeleton" style={{ height: 120 }} />
          </div>
        </div>
      </Layout>
    );
  }

  const mostFrequentAction = stats.top_actions?.[0]?.action || 'document.edit';

  return (
    <Layout>
      <div className="animate-fade-in-up">
        <div className="kpi-grid">
          <div className="kpi-card">
            <div>
              <div className="kpi-label">Total events</div>
              <div className="kpi-value">{stats.total_events?.toLocaleString() || '0'}</div>
              <div className="kpi-trend up">↑ 14% from last week</div>
            </div>
            <div className="kpi-icon primary">
              <EventsIcon />
            </div>
          </div>
          <div className="kpi-card">
            <div>
              <div className="kpi-label">Active users</div>
              <div className="kpi-value">{stats.unique_users?.toLocaleString() || '0'}</div>
              <div className="kpi-trend up">↑ 8% from last week</div>
            </div>
            <div className="kpi-icon success">
              <UsersIcon />
            </div>
          </div>
          <div className="kpi-card">
            <div>
              <div className="kpi-label">Most frequent action</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: 6 }}>
                {mostFrequentAction}
              </div>
            </div>
            <div className="kpi-icon warning">
              <ZapIcon />
            </div>
          </div>
        </div>

        <div className="card section">
          <div className="card-body">
            <div className="section-header">
              <span className="section-title">Activity trend</span>
              <span className="section-meta">Last 7 days</span>
            </div>
            <BarChart data={stats.last_7_days} height={80} />
          </div>
        </div>

        <div className="section-header section-sm">
          <span className="section-title">Recent Activity</span>
          <button className="section-link" onClick={() => (window.location.href = '/events')}>
            View all →
          </button>
        </div>

        {recentEvents.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-title">No events yet</div>
              <div className="empty-desc">Send events using your API key to see them here</div>
            </div>
          </div>
        ) : (
          recentEvents.map((event, idx) => {
            const actionClass = getActionClass(event.action);
            const isSuccess =
              (event.action || '').includes('login') || (event.action || '').includes('create');
            const isCritical = (event.action || '').includes('delete');
            return (
              <div
                key={event.id}
                className="event-card"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="event-card-top">
                  <div className="event-user-row">
                    <div className="event-avatar" style={{ fontSize: '1rem' }}>
                      {getAvatarEmoji(event.action)}
                    </div>
                    <div>
                      <div className="event-user-name">
                        <span
                          className={actionClass}
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          {event.action || 'unknown_action'}
                        </span>
                      </div>
                      <div className="event-time">
                        {event.user_email || `User: ${event.user_id}`}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '.6875rem', color: 'var(--text-tertiary)' }}>
                    {getRelativeTime(event.created_at)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  {isSuccess && <span className="tag tag-success">SUCCESS</span>}
                  {isCritical && <span className="tag tag-critical">CRITICAL</span>}
                  {event.ip_address && (
                    <span className="tag tag-default">IP: {event.ip_address}</span>
                  )}
                  {event.resource_id && (
                    <span className="tag tag-default">ID: {event.resource_id}</span>
                  )}
                  {event.app_id && <span className="tag tag-default">App: {event.app_id}</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
