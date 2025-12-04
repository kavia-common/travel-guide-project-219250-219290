import React, { useMemo, useState } from 'react';
import { useNotifications, NOTIFICATION_CATEGORIES } from '../notifications/NotificationsContext';
import { Container } from '../components/SharedUI';
import '../components/SharedUI.css';
import '../components/Header.css';
import '../App.css';

// PUBLIC_INTERFACE
export default function NotificationsPage() {
  /**
   * Notifications page: lists all alerts with filtering by category and status.
   * Provides actions to mark all as read and individual entries as read.
   */
  const { notifications, markAllRead, markRead } = useNotifications();
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const catOk = category === 'all' || n.category === category;
      const statusOk = status === 'all' || (status === 'unread' ? !n.read : n.read);
      return catOk && statusOk;
    });
  }, [notifications, category, status]);

  const iconFor = (cat) => {
    switch (cat) {
      case NOTIFICATION_CATEGORIES.DEAL: return '💸';
      case NOTIFICATION_CATEGORIES.EVENT: return '🎉';
      case NOTIFICATION_CATEGORIES.ADVISORY: return '⚠️';
      default: return '🔔';
    }
  };

  return (
    <section role="region" aria-label="Notifications">
      <Container className="tg-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 className="tg-section__title" style={{ marginBottom: 6 }}>Notifications</h1>
            <p className="tg-section__subtitle" style={{ marginTop: 0 }}>
              View alerts about deals, events, and travel advisories.
            </p>
          </div>
          <div>
            <button className="tg-btn" onClick={markAllRead} aria-label="Mark all notifications as read">
              Mark all as read
            </button>
          </div>
        </div>

        <div role="toolbar" aria-label="Notifications filters" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10, marginBottom: 14 }}>
          <label>
            <span className="sr-only">Filter by category</span>
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              <option value="all">All categories</option>
              <option value={NOTIFICATION_CATEGORIES.DEAL}>Deals</option>
              <option value={NOTIFICATION_CATEGORIES.EVENT}>Events</option>
              <option value={NOTIFICATION_CATEGORIES.ADVISORY}>Advisories</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </label>
        </div>

        <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {filtered.map((n) => (
            <li key={n.id} role="listitem" style={{
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              padding: 12,
              background: 'var(--bg-primary)',
              display: 'grid',
              gridTemplateColumns: '28px 1fr auto',
              alignItems: 'start',
              gap: 10
            }}>
              <div aria-hidden="true" style={{
                width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: 8,
                background: 'color-mix(in srgb, #ff8a4c 22%, transparent)'
              }}>{iconFor(n.category)}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <strong>{n.title}</strong>
                  {!n.read && (
                    <span style={{
                      fontSize: 11, padding: '2px 6px', borderRadius: 999,
                      background: 'linear-gradient(135deg, #ff8a4c, #e0522c)', color: '#fff'
                    }}>Unread</span>
                  )}
                </div>
                <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>{n.message}</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 6 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    aria-label={`Mark ${n.title} as read`}
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    Mark read
                  </button>
                )}
                {n.link && (
                  <a
                    href={n.link}
                    className="tg-btn"
                    style={{ padding: '8px 10px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', justifyContent: 'center' }}
                    aria-label={`Open ${n.title}`}
                  >
                    Open
                  </a>
                )}
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li role="listitem" style={{ opacity: 0.8 }}>
              No notifications match the current filters.
            </li>
          )}
        </ul>
      </Container>
    </section>
  );
}
