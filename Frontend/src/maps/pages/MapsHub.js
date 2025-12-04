//
// MapsHub.js
// Maps page that combines MapView and RoutePlanner, supports deep-linking via query params.
//

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapsProvider, useMaps } from '../MapsContext';
import MapView from '../components/MapView';
import MapControls from '../components/MapControls';
import RoutePlanner from '../components/RoutePlanner';
import MapsService from '../MapsService';

function HubInner() {
  const { search } = useLocation();
  const { actions } = useMaps();

  useEffect(() => {
    const q = new URLSearchParams(search);
    const origin = q.get('origin');
    const dest = q.get('dest');
    const mode = q.get('mode');

    if (origin) {
      const match = MapsService.geocode(origin)[0];
      if (match) actions.plannerUpdate({ originText: match.name, originCoord: match.coord });
    }
    if (dest) {
      const match = MapsService.geocode(dest)[0];
      if (match) actions.plannerUpdate({ destinationText: match.name, destinationCoord: match.coord });
    }
    if (mode && ['walk', 'drive', 'transit'].includes(mode)) {
      actions.plannerUpdate({ mode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <h1>Maps</h1>
      <div className="maps-layout">
        <div style={{ position: 'relative' }}>
          <MapView height="68vh" />
          <MapControls />
        </div>
        <aside>
          <RoutePlanner />
          <div style={{ marginTop: 12, fontSize: 12, color: '#6b7280' }}>
            Tip: Click on any marker to select it and center the map.
          </div>
        </aside>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function MapsHub() {
  /** Wrap the maps hub with MapsProvider to expose map state. */
  return (
    <MapsProvider>
      <HubInner />
    </MapsProvider>
  );
}
