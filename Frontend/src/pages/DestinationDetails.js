import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../components/SharedUI';
import AverageRatingBadge from '../reviews/components/AverageRatingBadge';
import ReviewForm from '../reviews/components/ReviewForm';
import ReviewsList from '../reviews/components/ReviewsList';
import { useReviews } from '../reviews/ReviewsContext';
import '../components/SharedUI.css';
import '../components/Header.css';
import '../App.css';

/**
 * PUBLIC_INTERFACE
 * Minimal destination details page that includes a reviews widget.
 * Route: /destinations/:id
 */
export default function DestinationDetailsPage() {
  const { id } = useParams();
  const { addReview } = useReviews();

  // simple mock data for header visuals
  const banner = useMemo(() => {
    const map = {
      Paris: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop',
      Kyoto: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop',
      'New York': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
      Santorini: 'https://images.unsplash.com/photo-1509123322038-0239e03838d4?q=80&w=1600&auto=format&fit=crop',
    };
    return map[id] || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop';
  }, [id]);

  const onSubmit = async (data) => {
    await addReview(data);
  };

  return (
    <section role="region" aria-label="Destination details">
      <div style={{
        width: '100%',
        aspectRatio: '6 / 2',
        backgroundImage: `url("${banner}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <span className="sr-only">Destination banner image</span>
      </div>

      <Container className="tg-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <h1 className="tg-section__title" style={{ marginBottom: 6 }}>{id}</h1>
            <p className="tg-section__subtitle" style={{ marginTop: 0 }}>Basic destination info and user reviews.</p>
          </div>
          <AverageRatingBadge entityType="destination" entityId={id} size="md" />
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <ReviewForm entityType="destination" entityId={id} onSubmit={onSubmit} />
          <ReviewsList entityType="destination" entityId={id} />
        </div>

        <div style={{ marginTop: 12 }}>
          <Link to="/explore" className="tg-btn" aria-label="Back to Explore">← Back to Explore</Link>
        </div>
      </Container>
    </section>
  );
}
