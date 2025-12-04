import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications, NOTIFICATION_CATEGORIES } from '../notifications/NotificationsContext';
import './Notifications.css';

// PUBLIC_INTERFACE
export default function NotificationsBell() {
  /**
   * Renders a bell icon with unread badge and an accessible dropdown/panel listing notifications.
   * Provides actions to mark all as read and mark individual items as read.
   */
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onEsc(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const iconFor = (cat) => {
    switch (cat) {
      case NOTIFICATION_CATEGORIES.DEAL: return '💸';
      case NOTIFICATION_CATEGORIES.EVENT: return '🎉';
      case NOTIFICATION_CATEGORIES.ADVISORY: return '⚠️';
      default: return '🔔';
    }
  };

  const onItemClick = (n) => {
    markRead(n.id);
    if (n.link) {
      navigate(n.link);
      setOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        className="tg-bell"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="notifications-panel"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        onClick={() => setOpen((o) => !o)}
        ref={btnRef}
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && <span className="tg-bell__badge" aria-hidden="true">{unreadCount}</span>}
      </button>

      {open && (
        <div
          id="notifications-panel"
          className="tg-notify-panel"
          role="menu"
          aria-label="Notifications"
          ref={panelRef}
        >
          <div className="tg-notify-header">
            <h3 className="tg-notify-title">Notifications</h3>
            <div className="tg-notify-actions">
              <button className="tg-notify-action" onClick={markAllRead}>
                Mark all read
              </button>
            </div>
          </div>

          <ul className="tg-notify-list" role="listbox" aria-label="Recent notifications">
            {notifications.length === 0 && (
              <li className="tg-notify-item" role="option" aria-selected="false">
                <div className="tg-notify-item__icon" aria-hidden="true">🔕</div>
                <div className="tg-notify-item__content">
                  <p className="tg-notify-item__title">No notifications</p>
                  <p className="tg-notify-item__meta">You’re all caught up.</p>
                </div>
              </li>
            )}
            {notifications.slice(0, 7).map((n) => (
              <li
                key={n.id}
                className="tg-notify-item"
                role="option"
                aria-selected={!n.read}
              >
                <div className="tg-notify-item__icon" aria-hidden="true">{iconFor(n.category)}</div>
                <div className="tg-notify-item__content">
                  <p className="tg-notify-item__title">
                    {!n.read && <span className="sr-only">Unread: </span>}
                    {n.title}
                  </p>
                  <p className="tg-notify-item__meta">
                    {n.message}
                  </p>
                  <button
                    className="tg-notify-item__cta"
                    onClick={() => onItemClick(n)}
                    aria-label={`Open ${n.title}`}
                  >
                    Open
                  </button>
                  {!n.read && (
                    <button
                      className="tg-notify-item__cta"
                      style={{ marginLeft: 8 }}
                      onClick={() => markRead(n.id)}
                      aria-label={`Mark ${n.title} as read`}
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <div aria-hidden="true" style={{ fontSize: 12, opacity: 0.65, paddingTop: 4 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>

          <div className="tg-notify-footer">
            <Link to="/notifications" className="tg-notify-viewall" onClick={() => setOpen(false)}>
              View all
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
