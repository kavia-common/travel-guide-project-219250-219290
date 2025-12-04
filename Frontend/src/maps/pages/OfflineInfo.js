//
// OfflineInfo.js
// Placeholder page describing offline mode and cached tiles concept.
//

import React from 'react';
import { MapsProvider } from '../MapsContext';

// PUBLIC_INTERFACE
export default function OfflineInfo() {
  /** Offline mode info explaining how cached tiles would work in the future. */
  return (
    <MapsProvider>
      <div>
        <h1>Offline Maps</h1>
        <p>
          In offline mode, the application would display cached map tiles and allow limited navigation
          and route previews without network connectivity.
        </p>
        <ul>
          <li>Pre-download regions for offline access.</li>
          <li>Use cached POIs and basic route skeletons.</li>
          <li>Sync updates when back online.</li>
        </ul>
        <p style={{ color: '#6b7280' }}>
          Note: This is currently a placeholder. TODO: integrate tile caching and offline packages.
        </p>
      </div>
    </MapsProvider>
  );
}
