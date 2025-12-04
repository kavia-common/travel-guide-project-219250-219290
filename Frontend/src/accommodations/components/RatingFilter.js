import React from 'react';
import './accommodations.css';

// PUBLIC_INTERFACE
export default function RatingFilter({ minRating, onChange }) {
  return (
    <div className="rating-filter">
      <label htmlFor="min-rating">Minimum rating</label>
      <select
        id="min-rating"
        value={minRating}
        onChange={(e) => onChange?.(Number(e.target.value))}
      >
        {[0, 3, 3.5, 4, 4.5].map(v => (
          <option key={v} value={v}>{v === 0 ? 'Any' : `${v}+`}</option>
        ))}
      </select>
    </div>
  );
}
