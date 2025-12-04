import React from 'react';
import './accommodations.css';

// PUBLIC_INTERFACE
export default function AmenitiesChips({ allAmenities, selected, onToggle }) {
  if (!allAmenities?.length) return null;
  return (
    <div className="chip-row" role="group" aria-label="Amenities filter">
      {allAmenities.map(a => {
        const active = selected.has(a);
        return (
          <button
            key={a}
            type="button"
            className={`chip ${active ? 'chip-active' : ''}`}
            aria-pressed={active}
            onClick={() => onToggle?.(a)}
          >
            {a}
          </button>
        );
      })}
    </div>
  );
}
