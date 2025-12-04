import React, { useEffect, useRef, useState } from 'react';
import './SafetyComponents.css';

// PUBLIC_INTERFACE
export default function SafetySearchBar({ presets = [], onSearch, initialQuery = '' }) {
  /**
   * Search bar with location/country presets and free text search.
   * onSearch: ({ query, regionCode, category, severity }) => void | Promise<void>
   */
  const [query, setQuery] = useState(initialQuery);
  const [regionCode, setRegionCode] = useState('any');
  const [category, setCategory] = useState('all');
  const [severity, setSeverity] = useState('all');
  const submitBtnRef = useRef(null);
  const liveRef = useRef(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (msg && liveRef.current) {
      liveRef.current.textContent = msg;
      const t = setTimeout(() => { if (liveRef.current) liveRef.current.textContent = ''; }, 1200);
      return () => clearTimeout(t);
    }
  }, [msg]);

  const onSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ query, regionCode: regionCode === 'any' ? '' : regionCode, category, severity });
    setMsg('Searching safety tips');
    submitBtnRef.current?.focus();
  };

  return (
    <form className="sf-toolbar" role="search" aria-label="Search safety tips" onSubmit={onSubmit} noValidate>
      <div className="sr-only" aria-live="polite" aria-atomic="true" ref={liveRef} />
      <label>
        <span className="sr-only">Search text</span>
        <input
          className="sf-input"
          type="search"
          placeholder="Search by keyword or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search text"
        />
      </label>
      <label>
        <span className="sr-only">Country/Region</span>
        <select
          className="sf-select"
          value={regionCode}
          onChange={(e) => setRegionCode(e.target.value)}
          aria-label="Country or region"
        >
          <option value="any">Any country</option>
          {presets.map((p) => (
            <option key={p.regionCode} value={p.regionCode}>{p.name}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Category</span>
        <select
          className="sf-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Tip category"
        >
          <option value="all">All categories</option>
          <option value="General">General</option>
          <option value="Health">Health</option>
          <option value="Transport">Transport</option>
          <option value="Scams">Scams</option>
          <option value="Weather/Disasters">Weather/Disasters</option>
        </select>
      </label>
      <label>
        <span className="sr-only">Severity</span>
        <select
          className="sf-select"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          aria-label="Severity"
        >
          <option value="all">All severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <button ref={submitBtnRef} className="sf-chip" type="submit" aria-label="Search">
        Search
      </button>
    </form>
  );
}
