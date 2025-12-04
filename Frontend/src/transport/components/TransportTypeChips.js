import React from 'react';
import { useTransport } from '../TransportContext';
import '../../language/components/CategoryChips.js'; // ensure similar chip styles loaded if needed
import '../../components/SharedUI.css';

const TYPES = [
  { key: 'all', label: 'All' },
  { key: 'bus', label: 'Bus' },
  { key: 'train', label: 'Train' },
  { key: 'taxi', label: 'Taxi' },
];

// PUBLIC_INTERFACE
export default function TransportTypeChips({ ariaControlsId }) {
  /** Chips to filter by transport type; keyboard accessible. */
  const { typeFilter, setTypeFilter } = useTransport();

  return (
    <div className="tg-chips" role="tablist" aria-label="Transport type filters" aria-controls={ariaControlsId}>
      {TYPES.map((t) => {
        const selected = typeFilter === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={selected}
            tabIndex={0}
            className={`tg-chip ${selected ? 'selected' : ''}`}
            onClick={() => setTypeFilter(t.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setTypeFilter(t.key);
              }
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
