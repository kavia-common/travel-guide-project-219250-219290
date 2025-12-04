import React, { useEffect, useRef, useState } from 'react';
import './SafetyComponents.css';
import SafetyBadge from './SafetyBadge';

// PUBLIC_INTERFACE
export default function TipCard({ tip, autoFocus = false }) {
  /**
   * Displays a safety tip with category and severity; details are expandable.
   * tip: { id, title, details, category, severity }
   */
  const [open, setOpen] = useState(false);
  const headerBtnRef = useRef(null);

  useEffect(() => {
    if (autoFocus) headerBtnRef.current?.focus();
  }, [autoFocus]);

  return (
    <article className="sf-tip">
      <div className="sf-tip__head">
        <div style={{ display: 'grid', gap: 4 }}>
          <strong>{tip.title}</strong>
          <div className="sf-tip__meta">
            <span aria-label={`Category ${tip.category}`}>🏷️ {tip.category}</span>
            <SafetyBadge severity={tip.severity} />
          </div>
        </div>
        <button
          ref={headerBtnRef}
          type="button"
          className="sf-tip__toggle"
          aria-expanded={open}
          aria-controls={`tip-${tip.id}-content`}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Hide details' : 'Show details'}
        </button>
      </div>
      {open && (
        <div id={`tip-${tip.id}-content`} style={{ fontSize: 14 }}>
          {tip.details}
        </div>
      )}
    </article>
  );
}
