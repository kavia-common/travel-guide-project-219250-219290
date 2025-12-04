import React from 'react';
import './SafetyComponents.css';
import TipCard from './TipCard';

// PUBLIC_INTERFACE
export default function TipsList({ tips = [] }) {
  /** Renders a list of tips. */
  if (!tips || tips.length === 0) {
    return <p style={{ opacity: 0.8 }}>No tips match your current filters.</p>;
  }
  return (
    <ul className="sf-list" role="list" aria-label="Safety tips">
      {tips.map((t, idx) => (
        <li key={t.id} role="listitem">
          <TipCard tip={t} autoFocus={idx === 0} />
        </li>
      ))}
    </ul>
  );
}
