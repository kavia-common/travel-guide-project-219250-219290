# Maps Module

This module implements a mock, client-only maps feature:

- MapsService: mock geocoding, routing (straight polyline + steps), and tile mode switching.
- MapsContext: centralizes map state (center, zoom, tile mode, selected POI, planner).
- Components:
  - MapView: minimal DOM-based placeholder map with markers and route polyline.
  - MapControls: zoom, my-location (mock), tile toggle and legend.
  - RoutePlanner: origin/destination with autocomplete from sample POIs; distance/time summary; steps list.
  - MapWidget: embeddable small preview that links to the full map.

Pages:
- /maps: MapsHub that combines MapView and RoutePlanner side-by-side; responsive layout.
- /maps/offline: informational page about offline mode and future caching.

Accessibility:
- Inputs have labels, controls have aria-labels, and results announce via aria-live.

Deep linking:
- /maps?origin=...&dest=...&mode=... pre-fills the route planner. Items in Explore and Destination Details link accordingly.

TODOs:
- Replace MapView placeholder with a full-featured map library (Leaflet/react-leaflet).
- Integrate real tile layers for online mode and an offline cache strategy (Service Worker + IndexedDB).
- Wire real geocoding and routing providers.

No environment variables added. All data is mock/in-memory only.
