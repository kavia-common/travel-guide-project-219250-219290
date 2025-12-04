import React, { useEffect, useRef } from 'react';
import { useAccommodations } from '../AccommodationsContext';
import AccommodationsSearchBar from '../components/AccommodationsSearchBar';
import TypeChips from '../components/TypeChips';
import PriceFilter from '../components/PriceFilter';
import RatingFilter from '../components/RatingFilter';
import AmenitiesChips from '../components/AmenitiesChips';
import AccommodationList from '../components/AccommodationList';
import '../../components/SharedUI.css';
import '../components/accommodations.css';

// PUBLIC_INTERFACE
export default function AccommodationsHub() {
  const {
    query, setQuery,
    filtered, resultCount,
    filters, setFilter, toggleType, toggleAmenity,
    allAmenities,
    sortBy, setSortBy,
    sortDir, setSortDir,
    clearFilters,
  } = useAccommodations();

  const h1Ref = useRef(null);
  useEffect(() => {
    h1Ref.current?.focus();
  }, []);

  return (
    <div className="container">
      <h1 tabIndex={-1} ref={h1Ref}>Find a place to stay</h1>
      <AccommodationsSearchBar
        value={query}
        onChange={(v) => setQuery(v)}
        onSubmit={() => {}}
      />

      <div className="acc-filters" role="region" aria-label="Filters">
        <div className="types">
          <h3 className="h-subtle">Type</h3>
          <TypeChips selectedTypes={filters.type} onToggle={toggleType} />
        </div>
        <div className="price">
          <h3 className="h-subtle">Price range</h3>
          <PriceFilter
            min={filters.priceMin}
            max={filters.priceMax}
            onMinChange={(v) => setFilter('priceMin', v)}
            onMaxChange={(v) => setFilter('priceMax', v)}
          />
        </div>
        <div className="rating">
          <h3 className="h-subtle">Rating</h3>
          <RatingFilter
            minRating={filters.ratingMin}
            onChange={(v) => setFilter('ratingMin', v)}
          />
        </div>
        <div className="amenities">
          <h3 className="h-subtle">Amenities</h3>
          <AmenitiesChips
            allAmenities={allAmenities}
            selected={filters.amenities}
            onToggle={toggleAmenity}
          />
        </div>
        <div>
          <button className="btn-secondary" type="button" onClick={clearFilters}>Clear filters</button>
        </div>
        <div>
          <label htmlFor="sort-by" style={{ marginRight: '0.5rem' }}>Sort by</label>
          <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
          <button type="button" className="chip" style={{ marginLeft: '0.5rem' }} onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
            {sortDir === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      <p role="status" aria-live="polite">{resultCount} stays</p>

      <AccommodationList items={filtered} />
    </div>
  );
}
