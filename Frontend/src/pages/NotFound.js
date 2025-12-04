import React from 'react';
import '../App.css';

// PUBLIC_INTERFACE
export default function NotFound() {
  /** Simple 404 page shown for unmatched routes with accessible semantics. */
  return (
    <section role="region" aria-label="Page Not Found" className="App-header">
      <div>
        <h1 className="title" style={{ marginBottom: 8 }}>404</h1>
        <p className="description" style={{ marginTop: 0 }}>The page you are looking for does not exist.</p>
        <a className="App-link" href="/" aria-label="Go back to home">Go Home</a>
      </div>
    </section>
  );
}
