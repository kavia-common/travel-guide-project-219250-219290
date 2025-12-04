import React, { useMemo } from 'react';
import './reviews.css';

/**
 * PUBLIC_INTERFACE
 * Interactive star rating input with keyboard support.
 * Props:
 * - value: number (1..5)
 * - onChange: (n: number) => void
 * - readOnly?: boolean
 * - size?: 'sm' | 'md' | 'lg'
 * - ariaLabel?: string
 */
export default function RatingStars({ value = 0, onChange, readOnly = false, size = 'md', ariaLabel = 'Rating' }) {
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const onKey = (e, n) => {
    if (readOnly) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange?.(n);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange?.(Math.min(5, (value || 0) + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange?.(Math.max(1, (value || 0) - 1));
    }
  };

  return (
    <div className={`rv-stars rv-stars--${size}`} role={readOnly ? 'img' : 'radiogroup'} aria-label={ariaLabel}>
      {stars.map((n) => {
        const filled = n <= (value || 0);
        const label = `${n} ${n === 1 ? 'star' : 'stars'}`;
        return (
          <div key={n} className="rv-star-wrap">
            {!readOnly ? (
              <button
                type="button"
                className={`rv-star ${filled ? 'is-filled' : ''}`}
                aria-label={label}
                aria-checked={filled}
                role="radio"
                onClick={() => onChange?.(n)}
                onKeyDown={(e) => onKey(e, n)}
              >
                {filled ? '★' : '☆'}
              </button>
            ) : (
              <span className={`rv-star ${filled ? 'is-filled' : ''}`} aria-label={label} aria-hidden={!filled}>
                {filled ? '★' : '☆'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
