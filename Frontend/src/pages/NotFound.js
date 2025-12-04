import React from 'react';
import '../App.css';

// PUBLIC_INTERFACE
export default function NotFound() {
  /** Simple 404 page shown for unmatched routes. */
  return (
    <div className="App">
      <header className="App-header" role="banner" aria-label="Page Not Found">
        <h1 style={{ marginBottom: 8 }}>404</h1>
        <p style={{ marginTop: 0 }}>The page you are looking for does not exist.</p>
        <a className="App-link" href="/" aria-label="Go back to home">Go Home</a>
      </header>
    </div>
  );
}
