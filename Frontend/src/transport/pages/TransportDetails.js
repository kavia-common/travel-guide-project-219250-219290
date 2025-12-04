import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTransport } from '../TransportContext';
import PassesCard from '../components/PassesCard';
import TipsNotice from '../components/TipsNotice';
import TransportList from '../components/TransportList';
import '../transport.css';
import '../../components/SharedUI.css';

// PUBLIC_INTERFACE
export default function TransportDetails() {
  /** Region-specific page showing passes, airport transfers, how-to-use notes, map placeholder, FAQ, and filtered list. */
  const { regionCode } = useParams();
  const { getRegionDetails } = useTransport();
  const region = getRegionDetails(regionCode);
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) topRef.current.focus();
  }, [regionCode]);

  if (!region) {
    return (
      <main className="tg-page tg-col tg-gap-16">
        <h1 ref={topRef} tabIndex={-1}>Region not found</h1>
        <Link className="tg-link" to="/transport">Back to Transport</Link>
      </main>
    );
  }

  return (
    <main className="tg-page tg-col tg-gap-16" aria-labelledby="transport-region-title">
      <header className="tg-row tg-justify-between tg-align-center tg-wrap">
        <h1 id="transport-region-title" tabIndex={-1} ref={topRef}>{region.name} Transport</h1>
        <Link className="tg-link" to="/transport" aria-label="Back to Transport hub">Back to Transport</Link>
      </header>

      <section className="tg-grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
        <PassesCard passes={region.passes} />
        <section className="tg-card" aria-label="Airport transfers">
          <h3 className="tg-card-title">Airport Transfers</h3>
          <ul className="tg-list">
            {region.airportTransfers?.map((t, i) => (
              <li key={i}>
                <strong>{t.mode}:</strong> {t.info}{' '}
                {t.link && <a className="tg-link" href={t.link} target="_blank" rel="noreferrer">Learn more</a>}
              </li>
            ))}
          </ul>
        </section>

        <section className="tg-card" aria-label="How to use public transport">
          <h3 className="tg-card-title">How to Use</h3>
          <ul className="tg-list">
            <li>Check schedules and service updates before travel.</li>
            <li>Carry a payment method accepted locally (cards, passes, or cash as needed).</li>
            <li>Respect priority seating and local etiquette.</li>
          </ul>
        </section>

        <TipsNotice tips={region.tips} title="Local Tips" />
      </section>

      <section className="tg-card" aria-label="Map">
        <h3 className="tg-card-title">Map</h3>
        <div style={{ height: 240, background: 'linear-gradient(135deg,#eef2ff,#f0fdf4)', border: '1px dashed var(--tg-border, #e5e7eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="tg-muted">Map placeholder</span>
        </div>
      </section>

      <section className="tg-card" aria-label="FAQ">
        <h3 className="tg-card-title">FAQ</h3>
        <dl className="tg-list">
          {region.faq?.map((f, i) => (
            <div key={i} className="tg-col tg-gap-4">
              <dt><strong>{f.q}</strong></dt>
              <dd className="tg-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <TransportList regionCode={region.code} resultsId="transport-region-results" />
    </main>
  );
}
