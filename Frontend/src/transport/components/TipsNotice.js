import React from 'react';
import '../../components/SharedUI.css';

// PUBLIC_INTERFACE
export default function TipsNotice({ tips = [], title = 'Tips' }) {
  /** Notice-styled list of tips. */
  if (!tips?.length) return null;
  return (
    <aside className="tg-notice info" role="note" aria-label={title}>
      <h3 className="tg-card-title">{title}</h3>
      <ul className="tg-list">
        {tips.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </aside>
  );
}
