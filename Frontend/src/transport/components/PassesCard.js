import React from 'react';
import '../../components/SharedUI.css';

// PUBLIC_INTERFACE
export default function PassesCard({ passes = [] }) {
  /** Shows available travel passes for a region. */
  if (!passes?.length) return null;
  return (
    <section className="tg-card" aria-label="Travel passes">
      <h3 className="tg-card-title">Travel Passes</h3>
      <ul className="tg-list">
        {passes.map((p, idx) => (
          <li key={idx}>
            <strong>{p.name}</strong> — {p.description} ({p.priceRange}){' '}
            {p.link && (
              <a className="tg-link" href={p.link} target="_blank" rel="noreferrer">Learn more</a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
