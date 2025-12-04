import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

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
        <Link
          className="App-link"
          to="/explore"
          aria-label="Start exploring destinations"
          role="button"
        >
          Start Exploring →
        </Link>
      </header>
    </div>
  );
}
