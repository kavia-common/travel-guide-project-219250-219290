//
// MapControls.js
// Map controls for zooming, locating, and toggling tile mode.
//
import React from 'react';
import { useMaps } from '../MapsContext';

// PUBLIC_INTERFACE
export default function MapControls() {
  /** Zoom, my-location, tile layer toggle and legend controls (accessible). */
  const {
    state: { ui, currentLocation, tileMode },
    actions
  } = useMaps();

  return (
    <div className="map-controls" role="group" aria-label="Map controls">
      <button
        onClick={() => actions.setZoom(Math.min(18, ui.zoom + 1))}
        aria-label="Zoom in"
        title="Zoom in"
      >
        +
      </button>
      <button
        onClick={() => actions.setZoom(Math.max(8, ui.zoom - 1))}
        aria-label="Zoom out"
        title="Zoom out"
      >
        −
      </button>
      <button
        onClick={() => {
          // Mock my location: center to currentLocation if available
          if (currentLocation) actions.setCenter(currentLocation);
        }}
        aria-label="Go to my location"
        title="My location"
      >
        ⊙
      </button>
      <button
        onClick={() => actions.setTileMode(tileMode === 'online' ? 'offline' : 'online')}
        aria-label="Toggle map layer between online and offline"
        title="Toggle map layer"
      >
        {tileMode === 'online' ? 'Go Offline' : 'Go Online'}
      </button>
      <div className="legend" aria-label="Map legend">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#ff3b30',
              border: '2px solid white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
            aria-hidden="true"
          />
          POI
        </div>
      </div>
    </div>
  );
}
