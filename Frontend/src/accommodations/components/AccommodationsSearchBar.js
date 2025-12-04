import React from 'react';
import './accommodations.css';

// PUBLIC_INTERFACE
export default function AccommodationsSearchBar({ value, onChange, onSubmit }) {
  /** Accessible search bar for destination/city input */
  return (
    <form
      className="acc-searchbar"
      role="search"
      aria-label="Search stays"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <label htmlFor="acc-search-input" className="sr-only">Destination or city</label>
      <input
        id="acc-search-input"
        type="text"
        placeholder="Search destination or city (e.g., Paris)"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-describedby="acc-search-help"
      />
      <button type="submit" className="btn-primary">Search</button>
      <div id="acc-search-help" className="sr-only">Type a city, region, or country to filter stays.</div>
    </form>
  );
}
