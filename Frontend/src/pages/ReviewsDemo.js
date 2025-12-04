import React, { useMemo, useState } from 'react';
import { Container } from '../components/SharedUI';
import { useReviews } from '../reviews/ReviewsContext';
import ReviewForm from '../reviews/components/ReviewForm';
import ReviewsList from '../reviews/components/ReviewsList';
import AverageRatingBadge from '../reviews/components/AverageRatingBadge';
import '../components/SharedUI.css';
import '../components/Header.css';
import '../App.css';

/**
 * PUBLIC_INTERFACE
 * Demo page for reviews: select an entity type and id, add reviews, and view the list and average.
 */
export default function ReviewsDemoPage() {
  const entityTypes = ['destination', 'hotel', 'restaurant'];
  const [entityType, setEntityType] = useState('destination');
  const [entityId, setEntityId] = useState('Paris');

  // helper to render small quick picks for demo
  const sampleOptions = useMemo(() => {
    if (entityType === 'destination') return ['Paris', 'Kyoto', 'New York', 'Santorini'];
    if (entityType === 'hotel') return ['Hotel-A', 'Hotel-B', 'Hotel-C'];
    return ['Restaurant-A', 'Restaurant-B', 'Restaurant-C'];
  }, [entityType]);

  const { addReview } = useReviews();

  const onSubmit = async (data) => {
    await addReview(data);
  };

  return (
    <section role="region" aria-label="Reviews and ratings demo">
      <Container className="tg-section">
        <h1 className="tg-section__title" style={{ marginBottom: 6 }}>Reviews & Ratings (Demo)</h1>
        <p className="tg-section__subtitle" style={{ marginTop: 0 }}>
          Try the reviews feature using in-memory storage. Future backend integration via REACT_APP_BACKEND_URL.
        </p>

        <div role="group" aria-label="Choose entity" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <label>
            <span className="sr-only">Entity type</span>
            <select
              aria-label="Entity type"
              value={entityType}
              onChange={(e) => { setEntityType(e.target.value); setEntityId(''); }}
              style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              {entityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Entity id</span>
            <select
              aria-label="Entity id"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              {sampleOptions.map((id) => <option key={id} value={id}>{id}</option>)}
            </select>
          </label>
          <AverageRatingBadge entityType={entityType} entityId={entityId} size="md" />
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <ReviewForm entityType={entityType} entityId={entityId} onSubmit={onSubmit} />
          <ReviewsList entityType={entityType} entityId={entityId} />
        </div>
      </Container>
    </section>
  );
}
