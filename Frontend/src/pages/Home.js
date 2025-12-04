import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Hero, Container } from '../components/SharedUI';
import '../components/SharedUI.css';
import '../components/Header.css';
import CurrencyConverterWidget from '../components/CurrencyConverterWidget';
import MiniTranslator from '../language/components/MiniTranslator';

// PUBLIC_INTERFACE
export default function Home() {
  /** Displays the main landing content for the Travel Guide app with hero section and CTA. */
  const heroImg = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop';

  return (
    <div role="region" aria-label="Home page content">
      {/* Inline skip-to-content link for accessibility via keyboard */}
      <a href="#main" className="sr-only">Skip to main content</a>

      <Hero
        title="Your adventure starts here"
        subtitle="Discover iconic cities, hidden gems, and unforgettable experiences across the globe."
        backgroundUrl={heroImg}
        cta={
          <Link
            to="/explore"
            className="tg-btn"
            aria-label="Start exploring destinations"
            role="button"
          >
            Start Exploring →
          </Link>
        }
      />

      <section className="tg-section">
        <Container>
          <h2 className="tg-section__title">Why Travel Guide?</h2>
          <p className="tg-section__subtitle">
            Hand-picked destinations, smart planning tools, and inspiring travel ideas.
          </p>
        </Container>
      </section>

      <section className="tg-section" aria-label="Quick currency conversion">
        <Container>
          <h2 className="tg-section__title">Travel smarter with quick currency conversion</h2>
          <p className="tg-section__subtitle">Use the compact converter below or open the full page for more details.</p>
          <CurrencyConverterWidget compact />
          <div style={{ marginTop: 10 }}>
            <Link to="/currency" className="tg-btn" aria-label="Open full currency converter">
              Open full converter →
            </Link>
          </div>
        </Container>
      </section>

      <section className="tg-section" aria-label="Mini translator">
        <Container>
          <h2 className="tg-section__title">Quick translator</h2>
          <p className="tg-section__subtitle">Translate common travel phrases instantly.</p>
          <MiniTranslator compact />
          <div style={{ marginTop: 10 }}>
            <Link to="/language" className="tg-btn" aria-label="Open language hub">
              Open Language Hub →
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
