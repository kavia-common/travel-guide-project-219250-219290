import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTransport } from '../TransportContext';
import TransportSearchBar from '../components/TransportSearchBar';
import TransportTypeChips from '../components/TransportTypeChips';
import TransportList from '../components/TransportList';
import '../transport.css';
import '../../components/SharedUI.css';

// PUBLIC_INTERFACE
export default function TransportHub() {
  /** Entry page for transport; allows region selection, search and type filters. */
  const { listRegions, selectedRegion, setSelectedRegion } = useTransport();
  const regions = listRegions();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const topRef = useRef(null);
  const [regionCode, setRegionCode] = useState(searchParams.get('region') || selectedRegion || 'all');

  useEffect(() => {
    const qRegion = searchParams.get('region');
    if (qRegion && qRegion !== regionCode) {
      setRegionCode(qRegion);
      setSelectedRegion(qRegion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (regionCode && regionCode !== 'all') next.set('region', regionCode);
      else next.delete('region');
      return next;
    });
  }, [regionCode, setSearchParams]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.focus();
    }
  }, []);

  const currentRegion = useMemo(() => {
    if (regionCode === 'all') return null;
    return regions.find(r => r.code === regionCode) || null;
  }, [regions, regionCode]);

  return (
    <main className="tg-page tg-col tg-gap-16" aria-labelledby="transport-hub-title">
      <h1 id="transport-hub-title" tabIndex={-1} ref={topRef}>Transport</h1>

      <section className="tg-row tg-gap-12 tg-wrap sticky-filters" aria-label="Filters">
        <div className="tg-row tg-gap-8 tg-wrap" style={{ flex: 1, minWidth: 260 }}>
          <label htmlFor="region-select" className="sr-only">Select city or region</label>
          <select
            id="region-select"
            className="tg-select"
            value={regionCode}
            onChange={(e) => {
              const val = e.target.value;
              setRegionCode(val);
              setSelectedRegion(val === 'all' ? null : val);
            }}
            aria-label="Select region"
          >
            <option value="all">All regions</option>
            {regions.map(r => (
              <option key={r.code} value={r.code}>{r.name} ({r.code})</option>
            ))}
          </select>

          {currentRegion && (
            <Link className="tg-btn" to={`/transport/${currentRegion.code}`} aria-label={`View ${currentRegion.name} details`}>
              View details
            </Link>
          )}
        </div>

        <div className="tg-col tg-gap-8" style={{ flex: 2, minWidth: 280 }}>
          <TransportSearchBar onSubmit={() => { /* list updates auto */ }} />
          <TransportTypeChips ariaControlsId="transport-results" />
        </div>
      </section>

      <TransportList regionCode={regionCode} resultsId="transport-results" />
    </main>
  );
}
