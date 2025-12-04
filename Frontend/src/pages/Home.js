import React from 'react';
import '../App.css';

// PUBLIC_INTERFACE
export default function Home() {
  /** Displays the main landing content for the Travel Guide app. */
  return (
    <div className="App">
      <header className="App-header" role="banner" aria-label="Travel Guide Home">
        <h1 className="title" style={{ marginBottom: 8 }}>Travel Guide</h1>
        <p className="description" style={{ marginTop: 0 }}>
          Discover destinations, plan trips, and explore local experiences.
        </p>
        <a
          className="App-link"
          href="#discover"
          onClick={(e) => e.preventDefault()}
          aria-label="Discover destinations (demo link)"
        >
          Start Exploring →
        </a>
      </header>
    </div>
  );
}
