//
// MapsService.js
// Mock maps service abstraction for geocoding, routing, and tile mode switching.
// TODO: Integrate real providers (e.g., Mapbox/OSM tiles, Google Directions) in future iterations.
//

/**
 * Sample Points of Interest (POIs) used for autocomplete and marker display.
 * Coordinates are mock/sanitized near well-known landmarks.
 */
const SAMPLE_POIS = [
  {
    id: 'poi_1',
    name: 'Central Park',
    category: 'Park',
    coord: { lat: 40.785091, lng: -73.968285 },
    description: 'A large city park offering recreation and relaxation.'
  },
  {
    id: 'poi_2',
    name: 'Grand Museum',
    category: 'Museum',
    coord: { lat: 40.779437, lng: -73.963244 },
    description: 'Explore world-class art and history exhibits.'
  },
  {
    id: 'poi_3',
    name: 'Union Station',
    category: 'Transit',
    coord: { lat: 40.752726, lng: -73.977229 },
    description: 'Major train and transit hub with shops and dining.'
  },
  {
    id: 'poi_4',
    name: 'Riverside Market',
    category: 'Food',
    coord: { lat: 40.799000, lng: -73.970000 },
    description: 'Local market with fresh produce and street food.'
  },
  {
    id: 'poi_5',
    name: 'Skyline Viewpoint',
    category: 'Scenic',
    coord: { lat: 40.730610, lng: -73.935242 },
    description: 'Panoramic viewpoint ideal for sunsets and photos.'
  }
];

/**
 * Simple mock polyline generator between origin and destination.
 * Produces a few intermediate points to simulate a route line.
 */
function mockPolyline(origin, destination) {
  const points = [];
  const steps = 10;
  const latStep = (destination.lat - origin.lat) / steps;
  const lngStep = (destination.lng - origin.lng) / steps;
  for (let i = 0; i <= steps; i++) {
    points.push({
      lat: origin.lat + latStep * i,
      lng: origin.lng + lngStep * i
    });
  }
  return points;
}

/**
 * Compute mock distance (km) using haversine formula and estimate duration by mode.
 */
function mockDistanceAndDuration(origin, destination, mode = 'walk') {
  const R = 6371; // km
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(destination.lat - origin.lat);
  const dLon = toRad(destination.lng - origin.lng);
  const lat1 = toRad(origin.lat);
  const lat2 = toRad(destination.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  // crude average speeds
  const speeds = {
    walk: 5, // km/h
    drive: 40,
    transit: 25
  };
  const speed = speeds[mode] || speeds.walk;
  const durationHours = distanceKm / speed;
  const durationMinutes = Math.round(durationHours * 60);

  return { distanceKm: Math.round(distanceKm * 10) / 10, durationMinutes };
}

/**
 * Create mock turn-by-turn steps.
 */
function mockSteps(polyline) {
  const out = [];
  for (let i = 1; i < polyline.length; i++) {
    out.push({
      instruction: `Proceed to point ${i}`,
      coord: polyline[i],
      distanceMeters: 120 + i * 10,
      durationSeconds: 60 + i * 5
    });
  }
  return out;
}

/**
 * PUBLIC_INTERFACE
 * MapsService provides methods for maps-related operations with mock implementations.
 */
const MapsService = {
  // PUBLIC_INTERFACE
  getSamplePOIs() {
    /** Return the in-memory sample POIs list. */
    return SAMPLE_POIS;
  },

  // PUBLIC_INTERFACE
  geocode(query) {
    /**
     * Mock geocoding: filter sample POIs by name substring match.
     * TODO: Integrate real geocoding provider in future (e.g., Mapbox Geocoding, Nominatim).
     */
    if (!query) return [];
    const q = query.toLowerCase();
    return SAMPLE_POIS.filter((p) => p.name.toLowerCase().includes(q));
  },

  // PUBLIC_INTERFACE
  reverseGeocode(coord) {
    /**
     * Mock reverse geocode: find nearest POI by simple distance.
     * TODO: Replace with provider lookup.
     */
    if (!coord) return null;
    let best = null;
    let bestD = Number.MAX_VALUE;
    for (const p of SAMPLE_POIS) {
      const dLat = p.coord.lat - coord.lat;
      const dLng = p.coord.lng - coord.lng;
      const d = Math.sqrt(dLat * dLat + dLng * dLng);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best;
  },

  // PUBLIC_INTERFACE
  planRoute({ origin, destination, mode = 'walk' }) {
    /**
     * Mock routing: create a straight polyline and steps, plus summary info.
     * TODO: Integrate with real directions API later.
     */
    if (!origin || !destination) {
      return {
        ok: false,
        error: 'Origin and destination are required.',
        route: null
      };
    }

    const polyline = mockPolyline(origin, destination);
    const steps = mockSteps(polyline);
    const { distanceKm, durationMinutes } = mockDistanceAndDuration(origin, destination, mode);

    return {
      ok: true,
      error: null,
      route: {
        polyline,
        steps,
        summary: {
          distanceKm,
          durationMinutes,
          mode
        }
      }
    };
  },

  // PUBLIC_INTERFACE
  getTileModeOptions() {
    /**
     * Return supported tile modes.
     * TODO: Wire to online/offline tile providers when available.
     */
    return ['online', 'offline'];
  },

  // PUBLIC_INTERFACE
  switchTileMode(mode) {
    /**
     * Stub for switching tile mode. Returns the resolved mode.
     * Mode validation happens here; for now, we just echo back a valid mode.
     */
    const opts = this.getTileModeOptions();
    if (!opts.includes(mode)) return 'online';
    return mode;
  }
};

export default MapsService;
