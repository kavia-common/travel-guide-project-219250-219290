//
// MapWidget.js
// Embeddable small map preview that links to the full Maps page with prefilled params.
//

import React from 'react';
import { Link } from 'react-router-dom';
import './maps.css';

// PUBLIC_INTERFACE
export default function MapWidget({ originName, destName, height = 160 }) {
  /** Small interactive preview that links to /maps with query params */
  const params = new URLSearchParams();
  if (originName) params.set('origin', originName);
  if (destName) params.set('dest', destName);

  return (
    <div className="map-container" style={{ height }}>
      <div className="map-surface" aria-hidden="true">
        <div className="map-backdrop">Preview map</div>
      </div>
      <div style={{ marginTop: 8 }}>
        <Link to={`/maps?${params.toString()}`} aria-label="Open map with route">
          View on Map
        </Link>
      </div>
    </div>
  );
}
