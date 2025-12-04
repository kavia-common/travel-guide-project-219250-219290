import React, { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import AccommodationsService from './AccommodationsService';

// Data model reference:
// Accommodation: {
//   id, name, city, region, country, type: 'hotel'|'hostel'|'guesthouse',
//   pricePerNight, rating, amenities: [string], photos: [string],
//   policies: string, locationText: string, featured?: boolean
// }

// PUBLIC_INTERFACE
export const AccommodationsContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AccommodationsProvider supplies accommodations data, filters/search, sorting, and reservation state.
 * It currently uses in-memory seed data with a stub service for future backend integration.
 */
export function AccommodationsProvider({ children }) {
  const service = useMemo(() => new AccommodationsService(process.env.REACT_APP_BACKEND_URL), []);
  const [accommodations, setAccommodations] = useState([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    type: new Set(), // hotel, hostel, guesthouse
    priceMin: 0,
    priceMax: 2000,
    ratingMin: 0,
    amenities: new Set(), // e.g., wifi, breakfast, pool
  });
  const [sortBy, setSortBy] = useState('price'); // 'price' | 'rating'
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'
  const [reservations, setReservations] = useState({}); // { id: reservation }

  // Initialize seed data (could be replaced with service.fetchAll() later)
  useEffect(() => {
    const seed = service.getSeedData();
    setAccommodations(seed);
  }, [service]);

  const allAmenities = useMemo(() => {
    const s = new Set();
    accommodations.forEach(a => (a.amenities || []).forEach(am => s.add(am)));
    return Array.from(s).sort();
  }, [accommodations]);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => {
      const next = { ...prev };
      if (key === 'type' || key === 'amenities') {
        // Expect Set for multi-select
        next[key] = new Set(value);
      } else {
        next[key] = value;
      }
      return next;
    });
  }, []);

  const toggleType = useCallback((type) => {
    setFilters(prev => {
      const next = { ...prev, type: new Set(prev.type) };
      if (next.type.has(type)) next.type.delete(type);
      else next.type.add(type);
      return next;
    });
  }, []);

  const toggleAmenity = useCallback((amenity) => {
    setFilters(prev => {
      const next = { ...prev, amenities: new Set(prev.amenities) };
      if (next.amenities.has(amenity)) next.amenities.delete(amenity);
      else next.amenities.add(amenity);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      city: '',
      type: new Set(),
      priceMin: 0,
      priceMax: 2000,
      ratingMin: 0,
      amenities: new Set(),
    });
    setQuery('');
    setSortBy('price');
    setSortDir('asc');
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const city = (filters.city || '').trim().toLowerCase();
    let results = accommodations.filter(a => {
      // city/destination
      const matchesCity = city ? (a.city?.toLowerCase().includes(city) || a.region?.toLowerCase().includes(city) || a.country?.toLowerCase().includes(city)) : true;
      // free text query: name and location text
      const matchesQuery = q ? (
        a.name?.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q) ||
        a.region?.toLowerCase().includes(q) ||
        a.country?.toLowerCase().includes(q) ||
        a.locationText?.toLowerCase().includes(q)
      ) : true;
      // type
      const matchesType = filters.type.size > 0 ? filters.type.has(a.type) : true;
      // price range
      const price = Number(a.pricePerNight || 0);
      const matchesPrice = price >= Number(filters.priceMin) && price <= Number(filters.priceMax);
      // rating
      const matchesRating = Number(a.rating || 0) >= Number(filters.ratingMin);
      // amenities
      const hasAmenities = filters.amenities.size > 0 ? Array.from(filters.amenities).every(am => (a.amenities || []).includes(am)) : true;

      return matchesCity && matchesQuery && matchesType && matchesPrice && matchesRating && hasAmenities;
    });

    results.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'price') {
        return (Number(a.pricePerNight) - Number(b.pricePerNight)) * dir;
      }
      if (sortBy === 'rating') {
        return (Number(a.rating) - Number(b.rating)) * dir;
      }
      return 0;
    });

    return results;
  }, [accommodations, query, filters, sortBy, sortDir]);

  const resultCount = filtered.length;

  // Reservations
  // PUBLIC_INTERFACE
  const createReservation = useCallback((payload) => {
    // payload: { accommodationId, checkIn, checkOut, guests, roomType, priceEstimate, customerName?, customerEmail? }
    // create a client-side reference number
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    const reference = `RSV-${ts}-${rand}`.toUpperCase();

    const reservation = {
      id: reference,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...payload,
    };
    setReservations(prev => ({ ...prev, [reservation.id]: reservation }));
    return reservation;
  }, []);

  // PUBLIC_INTERFACE
  const getReservation = useCallback((id) => reservations[id] || null, [reservations]);

  // Focus management helpers for accessibility (announce results)
  const liveRegionRef = useRef(null);
  useEffect(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `${resultCount} results`;
    }
  }, [resultCount]);

  const value = {
    accommodations,
    filtered,
    resultCount,
    query,
    setQuery,
    filters,
    setFilter,
    toggleType,
    toggleAmenity,
    allAmenities,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    clearFilters,
    createReservation,
    getReservation,
    liveRegionRef,
  };

  return (
    <AccommodationsContext.Provider value={value}>
      {/* aria-live region to announce result counts on filter changes */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}
        ref={liveRegionRef}
      />
      {children}
    </AccommodationsContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAccommodations() {
  const ctx = useContext(AccommodationsContext);
  if (!ctx) {
    throw new Error('useAccommodations must be used within AccommodationsProvider');
  }
  return ctx;
}
