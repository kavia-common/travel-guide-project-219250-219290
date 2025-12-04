import React from 'react';
import '../../components/SharedUI.css';
import './SafetyComponents.css';

// PUBLIC_INTERFACE
export default function CategoryChips({ categories = [], value = 'all', onChange }) {
  /** Renders filterable category chips including 'All'. */
  const allCats = ['all', ...categories];
  return (
    <div className="sf-toolbar" role="group" aria-label="Filter by category">
      {allCats.map((c) => {
        const active = String(value).toLowerCase() === String(c).toLowerCase();
        const label = c === 'all' ? 'All' : c;
        return (
          <button
            key={c}
            type="button"
            className={`sf-chip ${active ? 'is-active' : ''}`}
            aria-pressed={active}
            onClick={() => onChange?.(c)}
            aria-label={`Filter category: ${label}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
