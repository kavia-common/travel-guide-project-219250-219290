import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Hero, Container } from '../components/SharedUI';
import '../components/SharedUI.css';
import '../components/Header.css';

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
    </div>
  );
}
