import React, { useMemo, useState } from 'react';
import { useReviews } from '../ReviewsContext';
import RatingStars from './RatingStars';
import './reviews.css';

/**
 * PUBLIC_INTERFACE
 * ReviewsList shows a list of reviews for an entity with sorting, lazy-load, and item actions.
 * Props:
 * - entityType: string
 * - entityId: string|number
 * - pageSize?: number (default 5)
 */
export default function ReviewsList({ entityType, entityId, pageSize = 5 }) {
  const { listByEntity, markHelpful, reportReview, currentUser, deleteReview } = useReviews();
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const all = useMemo(() => listByEntity(entityType, entityId), [listByEntity, entityType, entityId]);
  const sorted = useMemo(() => {
    const rows = [...all];
    if (sort === 'newest') {
      rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'highest') {
      rows.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'lowest') {
      rows.sort((a, b) => a.rating - b.rating);
    }
    return rows;
  }, [all, sort]);
  const shown = sorted.slice(0, page * pageSize);
  const hasMore = sorted.length > shown.length;

  const loadMore = () => setPage((p) => p + 1);

  return (
    <section aria-label="Reviews list">
      <div className="rv-toolbar" role="toolbar" aria-label="Reviews sorting">
        <label>
          <span className="rv-sr">Sort by</span>
          <select
            className="rv-select"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            aria-label="Sort reviews"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
          </select>
        </label>
      </div>

      <ul className="rv-list" role="list" aria-label="User reviews">
        {shown.map((r) => (
          <li key={r.id} className="rv-item" role="listitem">
            <div className="rv-item-head">
              <div className="rv-item-title">
                <strong>{r.title}</strong>
              </div>
              <div className="rv-item-meta">
                <RatingStars value={r.rating} readOnly size="sm" ariaLabel={`Rating ${r.rating} stars`} />
                <span className="rv-dot">•</span>
                <span aria-label={`Author ${r.authorName}`}>By {r.authorName}</span>
                <span className="rv-dot">•</span>
                <time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleDateString()}</time>
              </div>
            </div>
            <p className="rv-item-text">{r.text}</p>
            <div className="rv-item-actions" role="group" aria-label={`Actions for review ${r.title}`}>
              <button className="rv-chip" onClick={() => markHelpful(r.id)} aria-label="Mark helpful">
                👍 Helpful ({r.helpfulCount || 0})
              </button>
              <button className="rv-chip" onClick={() => reportReview(r.id)} aria-label="Report review">
                🚩 Report
              </button>
              {/* Own review actions - no auth; visible if currentUser matches author */}
              {currentUser?.id === r.authorId && (
                <button
                  className="rv-chip rv-chip--danger"
                  onClick={() => deleteReview(r.id)}
                  aria-label="Delete your review"
                  title="Delete"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="rv-more">
          <button className="rv-btn" onClick={loadMore} aria-label="Load more reviews">Load more</button>
        </div>
      )}
      {sorted.length === 0 && (
        <p className="rv-empty">No reviews yet. Be the first to write one!</p>
      )}
    </section>
  );
}
