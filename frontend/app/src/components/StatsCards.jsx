import React from 'react';

const StatCard = ({ title, value, icon, bgColor }) => (
  <div
    className="card"
    style={{
      background: 'var(--bg-primary)',
      borderRadius: 16,
      border: '1px solid var(--border)',
      padding: 16,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        className={`${bgColor}`}
        style={{
          padding: 12,
          borderRadius: 12,
          fontSize: '1.5rem',
          background:
            bgColor === 'bg-blue-100'
              ? '#dbeafe'
              : bgColor === 'bg-green-100'
                ? '#d1fae5'
                : '#ede9fe',
        }}
      >
        {icon}
      </div>
      <div style={{ marginLeft: 16 }}>
        <div style={{ fontSize: '.875rem', color: 'var(--text-secondary)' }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {value}
        </div>
      </div>
    </div>
  </div>
);

const StatsCards = ({ stats }) => {
  const cards = [
    { title: 'Total Events', value: stats.total_events || 0, icon: '📝', bgColor: 'bg-blue-100' },
    { title: 'Unique Users', value: stats.unique_users || 0, icon: '👥', bgColor: 'bg-green-100' },
    { title: 'Active Apps', value: stats.active_apps || 0, icon: '📱', bgColor: 'bg-purple-100' },
  ];

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}
    >
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;
