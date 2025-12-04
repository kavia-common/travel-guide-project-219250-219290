import React from 'react';
import '../../components/SharedUI.css';

// PUBLIC_INTERFACE
export default function TransportCard({ option }) {
  /** Displays concise transport option info with links and quick tips. */
  if (!option) return null;
  const { name, operator, type, routes, coverage, schedule, fareRange, links, tips, regionName } = option;

  const typeBadge = {
    bus: 'Bus',
    train: 'Train',
    taxi: 'Taxi',
  }[type] || 'Transport';

  return (
    <article className="tg-card" aria-label={`${name} in ${regionName}`}>
      <header className="tg-row tg-align-center tg-justify-between tg-gap-8">
        <div>
          <h3 className="tg-card-title">{name}</h3>
          <p className="tg-muted">Operator: {operator} • {regionName}</p>
        </div>
        <span className={`tg-badge ${type}`}>{typeBadge}</span>
      </header>

      <div className="tg-card-body">
        <p><strong>Coverage:</strong> {coverage}</p>
        {routes?.length ? <p><strong>Routes:</strong> {routes.join(', ')}</p> : null}
        <p>
          <strong>Schedule:</strong> {schedule?.first} – {schedule?.last} • {schedule?.frequency}
        </p>
        <p><strong>Fares:</strong> {fareRange}</p>

        <div className="tg-row tg-gap-8 tg-wrap">
          {links?.official && <a className="tg-link" href={links.official} target="_blank" rel="noreferrer">Official site</a>}
          {links?.booking && <a className="tg-link" href={links.booking} target="_blank" rel="noreferrer">Booking</a>}
        </div>

        {tips?.length ? (
          <ul className="tg-list tg-mt-8">
            {tips.slice(0, 2).map((t, i) => <li key={i} className="tg-muted">Tip: {t}</li>)}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
