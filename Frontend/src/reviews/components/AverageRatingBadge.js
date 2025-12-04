import React, { useMemo } from 'react';
import { useReviews } from '../ReviewsContext';
import RatingStars from './RatingStars';
import './reviews.css';

/**
 * PUBLIC_INTERFACE
 * Displays average rating and count for a given entity.
 * Props:
 * - entityType
 * - entityId
 * - size?: 'sm' | 'md'
 */
export default function AverageRatingBadge({ entityType, entityId, size = 'sm' }) {
  const { getAverage } = useReviews();
  const { average, count } = useMemo(() => getAverage(entityType, entityId), [getAverage, entityType, entityId]);

  return (
    <div className={`rv-avg rv-avg--${size}`} aria-label={`Average rating ${average.toFixed(1)} out of 5 from ${count} reviews`}>
      <RatingStars value={Math.round(average)} readOnly size={size} ariaLabel="Average rating" />
      <div className="rv-avg-text">
        <strong>{average.toFixed(1)}</strong>
        <span className="rv-avg-sub">({count})</span>
      </div>
    </div>
  );
}
