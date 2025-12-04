import React from 'react';
import './accommodations.css';

// PUBLIC_INTERFACE
export default function PriceFilter({ min, max, onMinChange, onMaxChange }) {
  return (
    <div className="price-filter" aria-label="Price range filter">
      <div className="field">
        <label htmlFor="price-min">Min price</label>
        <input
          id="price-min"
          type="number"
          min={0}
          step={5}
          value={min}
          onChange={(e) => onMinChange?.(Number(e.target.value))}
          inputMode="numeric"
        />
      </div>
      <div className="field">
        <label htmlFor="price-max">Max price</label>
        <input
          id="price-max"
          type="number"
          min={0}
          step={5}
          value={max}
          onChange={(e) => onMaxChange?.(Number(e.target.value))}
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
