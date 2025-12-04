import React from 'react';
import Header from '../components/Header';
import { Container } from '../components/SharedUI';
import '../App.css';
import '../components/SharedUI.css';
import '../components/Header.css';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function ItineraryPage() {
  /**
   * Itinerary planner placeholder page.
   * Provides a basic introduction and links to start planning.
   * No backend calls are performed; this is a static intro.
   */
  return (
    <div role="region" aria-label="Itinerary planner">
      {/* keep consistent skip link target with App.js main id */}
      <a href="#main" className="sr-only">Skip to main content</a>

      {/* Header is already rendered at App.js level, but if this page is rendered standalone it remains safe */}
      {/* <Header /> */}

      <section className="tg-section">
        <Container>
          <h1 className="tg-section__title">Plan your trip</h1>
          <p className="tg-section__subtitle">
            Start crafting an unforgettable itinerary. Choose destinations, add activities, and organize each day of your journey.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
            <Link
              to="/explore"
              className="tg-btn"
              aria-label="Browse destinations to add to your trip"
              role="button"
            >
              Browse destinations →
            </Link>
            <Link
              to="/transport"
              className="tg-btn"
              aria-label="Check transport options for your itinerary"
              role="button"
            >
              Check transport →
            </Link>
          </div>

          <div style={{ marginTop: 24 }}>
            <p aria-live="polite">
              Tip: Use the Explore page to find places you love, then come back here to arrange your days.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
