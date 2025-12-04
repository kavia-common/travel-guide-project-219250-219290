import React from 'react';
import '../App.css';

// PUBLIC_INTERFACE
export default function Explore() {
  /** Simple Explore page for navigating from Home and verifying routing works. */
  return (
    <div className="App">
      <header className="App-header" role="banner" aria-label="Explore Destinations">
        <h1 className="title" style={{ marginBottom: 8 }}>Explore</h1>
        <p className="description" style={{ marginTop: 0 }}>
          Start discovering destinations, attractions, and experiences.
        </p>
        <a className="App-link" href="/" aria-label="Go back to home">
          ← Back to Home
        </a>
      </header>
    </div>
  );
}
