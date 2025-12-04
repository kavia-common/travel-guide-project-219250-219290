import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef, useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * Photo object shape used across the app.
 * @typedef {Object} Photo
 * @property {string} id - Unique identifier (uuid-like).
 * @property {string} url - Image URL (object URL or remote URL).
 * @property {string} caption - User-provided caption.
 * @property {string} location - Destination/location tag.
 * @property {string} uploader - Uploader display name or identifier.
 * @property {string} createdAt - ISO timestamp.
 * @property {boolean} isPublic - Whether photo is public/shareable.
 */

/**
 * PUBLIC_INTERFACE
 * PhotosService provides an abstraction for photo-related operations.
 * Currently implemented as stubs for future backend integration.
 * When integrating a backend, use REACT_APP_BACKEND_URL or REACT_APP_API_BASE.
 */
export class PhotosService {
  constructor(baseUrl = (process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE || '')) {
    this.baseUrl = baseUrl;
  }

  /**
   * PUBLIC_INTERFACE
   * Fetch all photos (stubbed).
   * Returns a Promise<Photo[]>
   */
  async fetchPhotos() {
    // TODO: replace with real API call e.g., `${this.baseUrl}/photos`
    // For now we return an empty array; initial seed handled in context.
    return Promise.resolve([]);
  }

  /**
   * PUBLIC_INTERFACE
   * Upload a new photo (stub).
   * @param {Photo} photo
   * Returns a Promise<Photo>
   */
  async uploadPhoto(photo) {
    // TODO: POST to backend; echo back created entity.
    return Promise.resolve(photo);
  }

  /**
   * PUBLIC_INTERFACE
   * Generate a shareable client-side URL for a given photo id.
   * For now, it's a route within the SPA.
   */
  getShareUrl(photoId) {
    return `/gallery/${encodeURIComponent(photoId)}`;
  }
}

/**
 * Seed data with a few sample public photos for the gallery.
 * Using unsplash images for mock content.
 */
const initialSeed = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop',
    caption: 'Sunrise over Santorini',
    location: 'Santorini, Greece',
    uploader: 'Ava',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isPublic: true,
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1481973964012-59aef0b8da9d?q=80&w=1600&auto=format&fit=crop',
    caption: 'Streets of Kyoto',
    location: 'Kyoto, Japan',
    uploader: 'Liam',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    isPublic: true,
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop',
    caption: 'Evening in Paris',
    location: 'Paris, France',
    uploader: 'Noah',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isPublic: true,
  },
];

const PhotosContext = createContext(null);

function photosReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, items: action.payload, loaded: true };
    case 'ADD':
      return { ...state, items: [action.payload, ...state.items] };
    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p)),
      };
    case 'REMOVE':
      return { ...state, items: state.items.filter((p) => p.id !== action.id) };
    default:
      return state;
  }
}

const initialState = {
  items: [],
  loaded: false,
};

/**
 * PUBLIC_INTERFACE
 * PhotosProvider manages in-memory photo list and exposes CRUD operations.
 */
export function PhotosProvider({ children, service = new PhotosService() }) {
  const [state, dispatch] = useReducer(photosReducer, initialState);
  const serviceRef = useRef(service);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Try fetch from (future) API; if empty, seed with default images
      const remote = await serviceRef.current.fetchPhotos().catch(() => []);
      const data = (remote && remote.length > 0) ? remote : initialSeed;
      if (mounted) {
        // Ensure newest first by createdAt
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        dispatch({ type: 'INIT', payload: sorted });
      }
    })();
    return () => { mounted = false; };
  }, []);

  // PUBLIC_INTERFACE
  const addPhoto = useCallback(async ({ file, previewUrl, caption, location, uploader, isPublic }) => {
    // Generate an id and store using object URL for preview
    const id = `p_${Math.random().toString(36).slice(2, 10)}`;
    const url = previewUrl; // in-memory object URL
    const createdAt = new Date().toISOString();
    const photo = { id, url, caption, location, uploader, createdAt, isPublic };

    // Call stubbed service (future integration point)
    const saved = await serviceRef.current.uploadPhoto(photo);
    dispatch({ type: 'ADD', payload: saved });
    return saved;
  }, []);

  // PUBLIC_INTERFACE
  const removePhoto = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);

  // PUBLIC_INTERFACE
  const updatePhoto = useCallback((photo) => dispatch({ type: 'UPDATE', payload: photo }), []);

  // PUBLIC_INTERFACE
  const getShareUrl = useCallback((id) => serviceRef.current.getShareUrl(id), []);

  const value = useMemo(() => ({
    loaded: state.loaded,
    photos: state.items,
    addPhoto,
    removePhoto,
    updatePhoto,
    getShareUrl,
  }), [state.loaded, state.items, addPhoto, removePhoto, updatePhoto, getShareUrl]);

  return (
    <PhotosContext.Provider value={value}>
      {children}
    </PhotosContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * Hook to use Photos context.
 */
export function usePhotos() {
  const ctx = useContext(PhotosContext);
  if (!ctx) throw new Error('usePhotos must be used within PhotosProvider');
  return ctx;
}
