import React from 'react';
import './SharedUI.css';

/**
 * PUBLIC_INTERFACE
 * Container to wrap sections and constrain width consistently.
 */
export function Container({ children, className = '', ...rest }) {
  return (
    <div className={`tg-container ${className}`} {...rest}>
      {children}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Hero section with background image and call to action.
 */
export function Hero({ title, subtitle, cta, backgroundUrl }) {
  return (
    <section
      className="tg-hero"
      role="region"
      aria-label="Featured destinations and call to action"
      style={{ '--hero-bg': `url("${backgroundUrl}")` }}
    >
      <div className="tg-hero__overlay" aria-hidden="true" />
      <Container className="tg-hero__content">
        <h1 className="tg-hero__title">{title}</h1>
        <p className="tg-hero__subtitle">{subtitle}</p>
        {cta}
      </Container>
    </section>
  );
}

/**
 * PUBLIC_INTERFACE
 * Card to display a destination tile.
 */
export function DestinationCard({ image, title, location, onClick, actionLabel = 'View' }) {
  return (
    <article className="tg-card" aria-label={`${title}, ${location}`}>
      <div className="tg-card__media" style={{ backgroundImage: `url("${image}")` }}>
        <span className="sr-only">{title} image</span>
      </div>
      <div className="tg-card__body">
        <h3 className="tg-card__title">{title}</h3>
        <p className="tg-card__meta" aria-label={`Location: ${location}`}>{location}</p>
        <button className="tg-btn" onClick={onClick} aria-label={`${actionLabel} ${title}`}>
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
