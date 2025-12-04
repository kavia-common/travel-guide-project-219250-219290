//
// MapView.js
// Minimal DOM-based map placeholder: renders a simple XY plane as map with markers.
// This avoids external libraries for now; replace with Leaflet/react-leaflet later if desired.
//

import React, { useEffect, useMemo, useRef } from 'react';
import { useMaps } from '../MapsContext';
import './maps.css';

// Simple linear projection (not geo-accurate), just to visualize relative positions.
function project(coord, center, zoom, size) {
  const scale = Math.pow(2, zoom - 13) * 8000; // arbitrary scale
  const dx = (coord.lng - center.lng) * scale;
  const dy = (coord.lat - center.lat) * -scale; // invert y
  return { x: size.width / 2 + dx, y: size.height / 2 + dy };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// PUBLIC_INTERFACE
export default function MapView({ height = '60vh', onMarkerClick }) {
  /** A simple, responsive map placeholder with markers and basic pan/zoom controls. */
  const {
    state: { ui, pois, selectedPlaceId, currentLocation, tileMode, planner },
    actions
  } = useMaps();

  const containerRef = useRef(null);
  const size = useMemo(() => ({ width: 800, height: 500 }), []); // will be matched via CSS for responsiveness

  // Handle wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -1 : 1;
      actions.setZoom(clamp(ui.zoom + delta, 8, 18));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [actions, ui.zoom]);

  // Handle mouse drag pan
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let dragging = false;
    let startX = 0;
    let startY = 0;

    const onDown = (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      el.style.cursor = 'grabbing';
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = e.clientX;
      startY = e.clientY;

      const scale = Math.pow(2, ui.zoom - 13) * 8000;
      const lngDelta = dx / scale;
      const latDelta = -dy / scale;
      actions.setCenter({ lat: ui.center.lat + latDelta, lng: ui.center.lng + lngDelta });
    };
    const onUp = () => {
      dragging = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [actions, ui.center, ui.zoom]);

  const selected = useMemo(
    () => pois.find((p) => p.id === selectedPlaceId) || null,
    [pois, selectedPlaceId]
  );

  // Plot route if available
  const routePolyline = planner?.result?.polyline || null;

  return (
    <div className="map-container" style={{ height }} aria-label="Interactive Map">
      <div className={`map-surface ${tileMode}`} ref={containerRef} role="application" tabIndex={0} aria-roledescription="map area">
        <div className="map-backdrop">Tile mode: {tileMode === 'offline' ? 'Offline (placeholder)' : 'Online (placeholder)'}</div>

        {/* Current Location */}
        {currentLocation && (
          <div
            className="map-marker current-location"
            style={projectStyle(currentLocation, ui.center, ui.zoom, size)}
            title="Your Location"
            aria-label="Your current location"
          />
        )}

        {/* POI Markers */}
        {pois.map((poi) => (
          <button
            key={poi.id}
            className={`map-marker poi ${poi.id === selectedPlaceId ? 'selected' : ''}`}
            style={projectStyle(poi.coord, ui.center, ui.zoom, size)}
            onClick={() => {
              actions.selectPlace(poi.id);
              if (onMarkerClick) onMarkerClick(poi);
            }}
            aria-label={`Marker: ${poi.name}`}
          />
        ))}

        {/* Route Polyline */}
        {routePolyline && (
          <svg className="map-overlay" aria-hidden="true">
            <polyline
              points={routePolyline
                .map((c) => {
                  const pt = project(c, ui.center, ui.zoom, size);
                  return `${pt.x},${pt.y}`;
                })
                .join(' ')}
              fill="none"
              stroke="rgba(0, 128, 255, 0.8)"
              strokeWidth="3"
            />
          </svg>
        )}

        {/* Selected Popup */}
        {selected && (
          <div
            className="map-popup"
            style={projectPopupStyle(selected.coord, ui.center, ui.zoom, size)}
            role="dialog"
            aria-label={`Details for ${selected.name}`}
          >
            <strong>{selected.name}</strong>
            <div className="sub">{selected.category}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function projectStyle(coord, center, zoom, size) {
  const pt = project(coord, center, zoom, size);
  return {
    left: `${pt.x}px`,
    top: `${pt.y}px`
  };
}

function projectPopupStyle(coord, center, zoom, size) {
  const pt = project(coord, center, zoom, size);
  return {
    left: `${pt.x + 10}px`,
    top: `${pt.y - 10}px`
  };
}
