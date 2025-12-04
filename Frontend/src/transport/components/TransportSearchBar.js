import React, { useEffect, useRef } from 'react';
import { useTransport } from '../TransportContext';
import '../../components/SharedUI.css';

// PUBLIC_INTERFACE
export default function TransportSearchBar({ onSubmit, placeholder = 'Search transport, operator, or route...', id = 'transport-search' }) {
  /** Accessible search bar for transport queries with aria-live region to announce results. */
  const { query, setQuery } = useTransport();
  const inputRef = useRef(null);

  useEffect(() => {
    // focus on mount for better keyboard flow
    if (inputRef.current) {
      inputRef.current.setAttribute('aria-label', 'Search transport');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(query);
  };

  return (
    <form role="search" aria-label="Transport search" onSubmit={handleSubmit} className="tg-row tg-gap-8" style={{ width: '100%' }}>
      <label htmlFor={id} className="sr-only">Search</label>
      <input
        id={id}
        ref={inputRef}
        type="search"
        className="tg-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="tg-btn primary" aria-label="Search transport">Search</button>
    </form>
  );
}
