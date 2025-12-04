import React from 'react';
import AccommodationCard from './AccommodationCard';
import './accommodations.css';

// PUBLIC_INTERFACE
export default function AccommodationList({ items }) {
  if (!items?.length) {
    return <p role="status" aria-live="polite">No stays found. Try adjusting filters.</p>;
  }
  return (
    <div className="acc-grid" role="list" aria-label="Search results">
      {items.map(item => (
        <div role="listitem" key={item.id} className="acc-grid-item">
          <AccommodationCard item={item} />
        </div>
      ))}
    </div>
  );
}
