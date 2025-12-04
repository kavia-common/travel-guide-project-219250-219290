import React, { createContext, useContext, useMemo, useReducer, useEffect, useCallback, useRef } from 'react';

// Types and categories for static demo notifications
export const NOTIFICATION_CATEGORIES = {
  DEAL: 'deal',
  EVENT: 'event',
  ADVISORY: 'advisory',
};

// PUBLIC_INTERFACE
export const NotificationsContext = createContext(null);

/**
 * Simulated initial notifications dataset.
 * In future, replace with fetch from API (see fetchNotifications stub below).
 */
const initialNotificationsSeed = [
  {
    id: 'n1',
    title: 'Spring Deals in Kyoto',
    message: 'Save up to 25% on select ryokan stays this month.',
    category: NOTIFICATION_CATEGORIES.DEAL,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    read: false,
    link: '/explore',
  },
  {
    id: 'n2',
    title: 'Paris Jazz Festival',
    message: 'Don’t miss live performances along the Seine this weekend.',
    category: NOTIFICATION_CATEGORIES.EVENT,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: false,
    link: '/explore',
  },
  {
    id: 'n3',
    title: 'Weather Advisory - Santorini',
    message: 'High winds expected; check ferry schedules before travel.',
    category: NOTIFICATION_CATEGORIES.ADVISORY,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    read: false,
    link: '/explore',
  },
  {
    id: 'n4',
    title: 'NYC Restaurant Week',
    message: 'Prix fixe menus available at top-rated spots.',
    category: NOTIFICATION_CATEGORIES.EVENT,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days
    read: true,
    link: '/explore',
  },
];

/**
 * Placeholder for future API integration to fetch notifications.
 * Uses environment variables for base URL when wired.
 */
async function fetchNotifications() {
  // Example stub for future:
  // const base = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE;
  // const res = await fetch(`${base}/notifications`);
  // return res.json();
  return Promise.resolve(initialNotificationsSeed);
}

/**
 * Reducer to manage notifications state transitions.
 */
function notificationsReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, items: action.payload, loaded: true };
    case 'MARK_ALL_READ':
      return {
        ...state,
        items: state.items.map((n) => ({ ...n, read: true })),
      };
    case 'MARK_READ':
      return {
        ...state,
        items: state.items.map((n) => (n.id === action.id ? { ...n, read: true } : n)),
      };
    case 'ADD':
      return {
        ...state,
        items: [action.payload, ...state.items],
        // Trigger aria-live announcement via a counter tick
        announceTick: state.announceTick + 1,
      };
    default:
      return state;
  }
}

const initialState = {
  items: [],
  loaded: false,
  announceTick: 0,
};

// PUBLIC_INTERFACE
export function NotificationsProvider({ children }) {
  /**
   * Provides notifications state and actions across the app via context.
   * Includes aria-live announcements for new alerts.
   */
  const [state, dispatch] = useReducer(notificationsReducer, initialState);
  const liveRegionRef = useRef(null);
  const lastAnnounceCountRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    fetchNotifications().then((data) => {
      if (mounted) {
        // sort by createdAt desc
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        dispatch({ type: 'INIT', payload: sorted });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Accessible announcement when new items are added
  useEffect(() => {
    if (!state.loaded) return;
    if (state.announceTick !== lastAnnounceCountRef.current) {
      lastAnnounceCountRef.current = state.announceTick;
      if (liveRegionRef.current) {
        const unread = state.items.filter((i) => !i.read).length;
        liveRegionRef.current.textContent = `New alert received. You have ${unread} unread notifications.`;
      }
    }
  }, [state.announceTick, state.loaded, state.items]);

  const markAllRead = useCallback(() => dispatch({ type: 'MARK_ALL_READ' }), []);
  const markRead = useCallback((id) => dispatch({ type: 'MARK_READ', id }), []);
  const addNotification = useCallback((n) => dispatch({ type: 'ADD', payload: n }), []);

  const unreadCount = useMemo(() => state.items.filter((i) => !i.read).length, [state.items]);

  const value = useMemo(
    () => ({
      loaded: state.loaded,
      notifications: state.items,
      unreadCount,
      markAllRead,
      markRead,
      addNotification,
    }),
    [state.loaded, state.items, unreadCount, markAllRead, markRead, addNotification]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {/* aria-live region for announcing new alerts */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        ref={liveRegionRef}
      />
      {children}
    </NotificationsContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useNotifications() {
  /** Hook to consume notifications context. */
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return ctx;
}
