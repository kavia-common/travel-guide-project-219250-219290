//
// RoutePlanner.js
// Route planning UI with autocomplete from sample POIs and mock results.
//
import React, { useMemo, useRef, useState } from 'react';
import { useMaps } from '../MapsContext';
import MapsService from '../MapsService';

// PUBLIC_INTERFACE
export default function RoutePlanner({ autoFocus = false }) {
  /** Route planning form with origin/destination, mode, and results display. */
  const {
    state: { planner },
    actions
  } = useMaps();

  const originRef = useRef(null);
  const destRef = useRef(null);
  const [announce, setAnnounce] = useState('');

  const originOptions = useMemo(() => {
    return planner.originText ? MapsService.geocode(planner.originText) : MapsService.getSamplePOIs();
  }, [planner.originText]);

  const destOptions = useMemo(() => {
    return planner.destinationText ? MapsService.geocode(planner.destinationText) : MapsService.getSamplePOIs();
  }, [planner.destinationText]);

  function pickOrigin(p) {
    actions.plannerUpdate({ originText: p.name, originCoord: p.coord });
  }
  function pickDestination(p) {
    actions.plannerUpdate({ destinationText: p.name, destinationCoord: p.coord });
  }

  function onSubmit(e) {
    e.preventDefault();
    actions.planRoute();
    setTimeout(() => {
      const r = planner.result;
      if (r?.summary) {
        setAnnounce(`Planned route: ${r.summary.distanceKm} km, ${r.summary.durationMinutes} minutes`);
      }
    }, 50);
  }

  return (
    <form onSubmit={onSubmit} className="planner-panel" aria-label="Route planner">
      <div className="planner-row">
        <label htmlFor="origin-input" style={{ minWidth: 70 }}>Origin</label>
        <input
          id="origin-input"
          ref={originRef}
          type="text"
          placeholder="Enter origin"
          aria-label="Origin"
          value={planner.originText}
          onChange={(e) => actions.plannerUpdate({ originText: e.target.value })}
          autoFocus={autoFocus}
        />
      </div>
      <AutoCompleteList
        labelId="origin-input"
        options={originOptions}
        onPick={pickOrigin}
      />

      <div className="planner-row">
        <label htmlFor="destination-input" style={{ minWidth: 70 }}>Destination</label>
        <input
          id="destination-input"
          ref={destRef}
          type="text"
          placeholder="Enter destination"
          aria-label="Destination"
          value={planner.destinationText}
          onChange={(e) => actions.plannerUpdate({ destinationText: e.target.value })}
        />
      </div>
      <AutoCompleteList
        labelId="destination-input"
        options={destOptions}
        onPick={pickDestination}
      />

      <div className="planner-row">
        <label htmlFor="mode-select" style={{ minWidth: 70 }}>Mode</label>
        <select
          id="mode-select"
          aria-label="Travel mode"
          value={planner.mode}
          onChange={(e) => actions.plannerUpdate({ mode: e.target.value })}
        >
          <option value="walk">Walk</option>
          <option value="drive">Drive</option>
          <option value="transit">Transit</option>
        </select>
        <div className="planner-actions" role="group" aria-label="Planner actions">
          <button type="submit" aria-label="Plan route">Plan Route</button>
          <button type="button" onClick={() => actions.clearPlanner()} aria-label="Clear planner">Clear</button>
        </div>
      </div>

      <div className="planner-results" aria-live="polite">
        {planner.error && <div role="alert">Error: {planner.error}</div>}
        {planner.result?.summary && (
          <>
            <div>
              Distance: <strong>{planner.result.summary.distanceKm} km</strong> • Duration:{' '}
              <strong>{planner.result.summary.durationMinutes} min</strong> • Mode:{' '}
              <strong>{planner.result.summary.mode}</strong>
            </div>
            <ol className="planner-steps">
              {planner.result.steps.slice(0, 8).map((s, idx) => (
                <li key={idx}>{s.instruction}</li>
              ))}
            </ol>
          </>
        )}
        <span className="sr-only" aria-live="polite">{announce}</span>
      </div>
    </form>
  );
}

function AutoCompleteList({ options, onPick, labelId }) {
  return (
    <div role="listbox" aria-labelledby={labelId} style={{ display: 'grid', gap: 4 }}>
      {options.slice(0, 5).map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onPick(opt)}
          aria-label={`Choose ${opt.name}`}
          style={{
            textAlign: 'left',
            padding: '6px 8px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          {opt.name}
          <span style={{ color: '#6b7280', marginLeft: 6, fontSize: 12 }}>· {opt.category}</span>
        </button>
      ))}
    </div>
  );
}
