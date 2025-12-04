import React from 'react';
import './accommodations.css';

const TYPES = [
  { key: 'hotel', label: 'Hotel' },
  { key: 'hostel', label: 'Hostel' },
  { key: 'guesthouse', label: 'Guesthouse' },
];

// PUBLIC_INTERFACE
export default function TypeChips({ selectedTypes, onToggle }) {
  return (
    <div className="chip-row" role="group" aria-label="Accommodation type filter">
      {TYPES.map(t => {
        const active = selectedTypes.has(t.key);
        return (
          <button
            key={t.key}
            type="button"
            className={`chip ${active ? 'chip-active' : ''}`}
            aria-pressed={active}
            onClick={() => onToggle?.(t.key)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
