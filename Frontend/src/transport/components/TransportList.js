import React, { useMemo } from 'react';
import { useTransport } from '../TransportContext';
import TransportCard from './TransportCard';
import '../../components/SharedUI.css';

// PUBLIC_INTERFACE
export default function TransportList({ regionCode = 'all', resultsId = 'transport-results' }) {
  /** Filtered list of TransportCard; announces count with aria-live. */
  const { typeFilter, listOptions, query } = useTransport();

  const items = useMemo(() => {
    return listOptions({ regionCode, type: typeFilter, q: query });
  }, [regionCode, typeFilter, query, listOptions]);

  return (
    <section aria-labelledby="transport-list-title" className="tg-col tg-gap-12">
      <h2 id="transport-list-title" className="sr-only">Transport results</h2>
      <div aria-live="polite" aria-atomic="true" className="tg-muted">
        {items.length} result{items.length !== 1 ? 's' : ''} found
      </div>
      <div id={resultsId} className="tg-grid responsive-cards">
        {items.map((opt) => (
          <TransportCard key={opt.id} option={opt} />
        ))}
      </div>
    </section>
  );
}
