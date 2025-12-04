const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * TransportService
 * A thin service layer to facilitate future backend integration.
 * For now, methods return Promises rejected to make it explicit that no backend is called.
 * TODO: Implement with real endpoints when available, e.g.:
 *  - GET `${BASE_URL}/transport/regions`
 *  - GET `${BASE_URL}/transport/options?region=US-NYC&type=train&q=subway`
 */
const TransportService = {
  // PUBLIC_INTERFACE
  async listRegions() {
    /** List regions from backend (not implemented). */
    return Promise.reject(new Error('TransportService.listRegions not implemented (using in-memory seed).'));
  },

  // PUBLIC_INTERFACE
  async listOptions({ region, type, q }) {
    /** List transport options via backend (not implemented). */
    return Promise.reject(new Error('TransportService.listOptions not implemented (using in-memory seed).'));
  },

  // PUBLIC_INTERFACE
  async getRegion(code) {
    /** Fetch a region details by code via backend (not implemented). */
    return Promise.reject(new Error('TransportService.getRegion not implemented (using in-memory seed).'));
  },
};

export default TransportService;
