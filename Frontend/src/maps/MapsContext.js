//
// MapsContext.js
// Provides context state for maps including selection, routing, and tile mode.
//

import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import MapsService from './MapsService';

// Types
// mode: 'walk' | 'drive' | 'transit'
// tileMode: 'online' | 'offline'

const MapsContext = createContext(null);

const initialState = {
  tileMode: 'online',
  pois: MapsService.getSamplePOIs(),
  currentLocation: null, // { lat, lng }
  selectedPlaceId: null,
  planner: {
    originText: '',
    destinationText: '',
    originCoord: null,
    destinationCoord: null,
    mode: 'walk',
    result: null, // { polyline, steps, summary }
    error: null
  },
  ui: {
    zoom: 13,
    center: { lat: 40.7831, lng: -73.9712 }, // default city center
    lastUpdated: Date.now()
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TILE_MODE':
      return { ...state, tileMode: MapsService.switchTileMode(action.mode) };

    case 'SET_CENTER':
      return { ...state, ui: { ...state.ui, center: action.center } };

    case 'SET_ZOOM':
      return { ...state, ui: { ...state.ui, zoom: action.zoom } };

    case 'SELECT_PLACE':
      return { ...state, selectedPlaceId: action.placeId };

    case 'SET_CURRENT_LOCATION':
      return { ...state, currentLocation: action.coord };

    case 'PLANNER_UPDATE':
      return { ...state, planner: { ...state.planner, ...action.patch } };

    case 'PLANNER_CLEAR':
      return {
        ...state,
        planner: {
          originText: '',
          destinationText: '',
          originCoord: null,
          destinationCoord: null,
          mode: 'walk',
          result: null,
          error: null
        }
      };

    case 'PLANNER_SET_RESULT':
      return {
        ...state,
        planner: { ...state.planner, result: action.result, error: null }
      };

    case 'PLANNER_SET_ERROR':
      return {
        ...state,
        planner: { ...state.planner, error: action.error, result: null }
      };

    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function MapsProvider({ children, initial }) {
  /** Provide MapsContext to children with state and actions. */
  const [state, dispatch] = useReducer(reducer, { ...initialState, ...(initial || {}) });

  // Derived helpers
  const actions = useMemo(() => {
    return {
      // PUBLIC_INTERFACE
      setTileMode: (mode) => dispatch({ type: 'SET_TILE_MODE', mode }),

      // PUBLIC_INTERFACE
      setCenter: (center) => dispatch({ type: 'SET_CENTER', center }),

      // PUBLIC_INTERFACE
      setZoom: (zoom) => dispatch({ type: 'SET_ZOOM', zoom }),

      // PUBLIC_INTERFACE
      selectPlace: (placeId) => dispatch({ type: 'SELECT_PLACE', placeId }),

      // PUBLIC_INTERFACE
      setCurrentLocation: (coord) => dispatch({ type: 'SET_CURRENT_LOCATION', coord }),

      // PUBLIC_INTERFACE
      plannerUpdate: (patch) => dispatch({ type: 'PLANNER_UPDATE', patch }),

      // PUBLIC_INTERFACE
      clearPlanner: () => dispatch({ type: 'PLANNER_CLEAR' }),

      // PUBLIC_INTERFACE
      planRoute: () => {
        const { originCoord, destinationCoord, mode } = state.planner;
        const res = MapsService.planRoute({
          origin: originCoord,
          destination: destinationCoord,
          mode
        });
        if (res.ok) {
          dispatch({ type: 'PLANNER_SET_RESULT', result: res.route });
        } else {
          dispatch({ type: 'PLANNER_SET_ERROR', error: res.error || 'Route planning failed' });
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.planner.originCoord, state.planner.destinationCoord, state.planner.mode]);

  // Initialize current location mock (could be permissions-based in future)
  useEffect(() => {
    // Mock: set a default current location slightly offset from center
    const timer = setTimeout(() => {
      dispatch({
        type: 'SET_CURRENT_LOCATION',
        coord: { lat: initialState.ui.center.lat + 0.01, lng: initialState.ui.center.lng + 0.01 }
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>;
}

// PUBLIC_INTERFACE
export function useMaps() {
  /** Hook to access maps state and actions. */
  const ctx = useContext(MapsContext);
  if (!ctx) throw new Error('useMaps must be used within a MapsProvider');
  return ctx;
}

export default MapsContext;
