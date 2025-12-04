import React, { createContext, useContext, useMemo, useReducer, useRef, useCallback } from 'react';

/**
 * Review type
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} entityType - type of entity like 'destination' | 'hotel' | 'restaurant'
 * @property {string} entityId - identifier of the entity
 * @property {number} rating - 1..5
 * @property {string} title
 * @property {string} text
 * @property {string[]} photos - urls (placeholder for future)
 * @property {string} authorId - temp stubbed user id for "own" review operations
 * @property {string} authorName
 * @property {string} createdAt - ISO
 * @property {string} updatedAt - ISO
 * @property {number} helpfulCount
 * @property {boolean} reported - placeholder
 */

/**
 * PUBLIC_INTERFACE
 * Abstraction for reviews operations; currently stubbed to in-memory and provides TODO notes for future backend.
 */
export class ReviewsService {
  /**
   * @param {string} baseUrl base API (REACT_APP_BACKEND_URL preferred, fallback REACT_APP_API_BASE)
   */
  constructor(baseUrl = (process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE || '')) {
    this.baseUrl = baseUrl;
  }

  // PUBLIC_INTERFACE
  async fetchByEntity(entityType, entityId) {
    /** TODO: GET `${this.baseUrl}/entities/${entityType}/${encodeURIComponent(entityId)}/reviews` */
    return Promise.resolve([]);
  }

  // PUBLIC_INTERFACE
  async createReview(review) {
    /** TODO: POST `${this.baseUrl}/reviews` */
    return Promise.resolve(review);
  }

  // PUBLIC_INTERFACE
  async updateReview(review) {
    /** TODO: PATCH `${this.baseUrl}/reviews/${review.id}` */
    return Promise.resolve(review);
  }

  // PUBLIC_INTERFACE
  async deleteReview(id) {
    /** TODO: DELETE `${this.baseUrl}/reviews/${id}` */
    return Promise.resolve(true);
  }
}

const ReviewsContext = createContext(null);

// A small demo seed for destinations
const initialSeed = [
  {
    id: 'r1',
    entityType: 'destination',
    entityId: 'Paris',
    rating: 5,
    title: 'Magical city break',
    text: 'Loved the museums and walks by the Seine. Highly recommend visiting in spring.',
    photos: [],
    authorId: 'demo-user',
    authorName: 'Ava',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    helpfulCount: 3,
    reported: false,
  },
  {
    id: 'r2',
    entityType: 'destination',
    entityId: 'Kyoto',
    rating: 4,
    title: 'Peaceful temples',
    text: 'Fushimi Inari was breathtaking at sunrise. Bring comfy shoes.',
    photos: [],
    authorId: 'guest',
    authorName: 'Liam',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    helpfulCount: 1,
    reported: false,
  },
];

function reviewsReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, items: action.payload, loaded: true };
    case 'ADD':
      return { ...state, items: [action.payload, ...state.items] };
    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((r) => (r.id === action.payload.id ? { ...r, ...action.payload } : r)),
      };
    case 'REMOVE':
      return { ...state, items: state.items.filter((r) => r.id !== action.id) };
    case 'HELPFUL':
      return {
        ...state,
        items: state.items.map((r) => (r.id === action.id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r)),
      };
    case 'REPORT':
      return {
        ...state,
        items: state.items.map((r) => (r.id === action.id ? { ...r, reported: true } : r)),
      };
    default:
      return state;
  }
}

const initialState = {
  items: initialSeed,
  loaded: true, // since we have seed
};

// PUBLIC_INTERFACE
export function ReviewsProvider({ children, service = new ReviewsService(), currentUser = { id: 'demo-user', name: 'You' } }) {
  /** Provides reviews state and CRUD operations. Auth is not implemented; own review actions are not enforced. */
  const [state, dispatch] = useReducer(reviewsReducer, initialState);
  const serviceRef = useRef(service);
  const currentUserRef = useRef(currentUser);

  // PUBLIC_INTERFACE
  const listByEntity = useCallback((entityType, entityId) => {
    return state.items
      .filter((r) => r.entityType === entityType && String(r.entityId) === String(entityId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [state.items]);

  // PUBLIC_INTERFACE
  const getAverage = useCallback((entityType, entityId) => {
    const rows = listByEntity(entityType, entityId);
    if (rows.length === 0) return { average: 0, count: 0 };
    const sum = rows.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return { average: sum / rows.length, count: rows.length };
  }, [listByEntity]);

  // PUBLIC_INTERFACE
  const addReview = useCallback(async ({ entityType, entityId, rating, title, text, photos = [] }) => {
    const now = new Date().toISOString();
    const id = `rev_${Math.random().toString(36).slice(2, 10)}`;
    const review = {
      id,
      entityType,
      entityId: String(entityId),
      rating: Number(rating),
      title: String(title || '').trim(),
      text: String(text || '').trim(),
      photos,
      authorId: currentUserRef.current.id,
      authorName: currentUserRef.current.name,
      createdAt: now,
      updatedAt: now,
      helpfulCount: 0,
      reported: false,
    };
    const saved = await serviceRef.current.createReview(review);
    dispatch({ type: 'ADD', payload: saved });
    return saved;
  }, []);

  // PUBLIC_INTERFACE
  const updateReview = useCallback(async (review) => {
    const updated = { ...review, updatedAt: new Date().toISOString() };
    const saved = await serviceRef.current.updateReview(updated);
    dispatch({ type: 'UPDATE', payload: saved });
    return saved;
  }, []);

  // PUBLIC_INTERFACE
  const deleteReview = useCallback(async (id) => {
    await serviceRef.current.deleteReview(id);
    dispatch({ type: 'REMOVE', id });
  }, []);

  // PUBLIC_INTERFACE
  const markHelpful = useCallback((id) => dispatch({ type: 'HELPFUL', id }), []);
  // PUBLIC_INTERFACE
  const reportReview = useCallback((id) => dispatch({ type: 'REPORT', id }), []);

  const value = useMemo(() => ({
    loaded: state.loaded,
    listByEntity,
    addReview,
    updateReview,
    deleteReview,
    getAverage,
    markHelpful,
    reportReview,
    currentUser: currentUserRef.current,
  }), [state.loaded, listByEntity, addReview, updateReview, deleteReview, getAverage, markHelpful, reportReview]);

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useReviews() {
  /** Hook to access Reviews context. */
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
}
