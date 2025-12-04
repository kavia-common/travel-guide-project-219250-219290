/* eslint react-hooks/exhaustive-deps: 0 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import SafetyService from './SafetyService';

// PUBLIC_INTERFACE
export const SafetyContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * SafetyProvider exposes safety regions, tips search, filters, and emergency contacts.
 * Uses in-memory SafetyService for now. Future-ready to use REACT_APP_BACKEND_URL.
 */
export function SafetyProvider({ children, service = new SafetyService() }) {
  const serviceRef = useRef(service);

  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [liveMsg, setLiveMsg] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const [rs, cats] = await Promise.all([
        serviceRef.current.listRegions(),
        serviceRef.current.getCategoryList(),
      ]);
      if (!active) return;
      setRegions(rs);
      setCategories(cats);
      setLoaded(true);
    })();
    return () => { active = false; };
  }, []);

  const doSearch = useCallback(async (q = query, { category: c = category, severity: s = severity } = {}) => {
    const results = await serviceRef.current.searchTips(q, { category: c, severity: s });
    setSearchResults(results);
    setLiveMsg(`${results.length} tip${results.length === 1 ? '' : 's'} found.`);
    return results;
  }, [query, category, severity]);

  const listTipsByRegion = useCallback(async (regionCode, filters = {}) => {
    return serviceRef.current.listTipsByRegion(regionCode, filters);
  }, []);

  const getEmergencyContacts = useCallback(async (regionCode) => {
    return serviceRef.current.getEmergencyContacts(regionCode);
  }, []);

  const suggestCountryPresets = useCallback(async () => {
    return serviceRef.current.suggestCountryPresets();
  }, []);

  const value = useMemo(() => ({
    loaded,
    regions,
    categories,
    query,
    setQuery,
    category,
    setCategory,
    severity,
    setSeverity,
    doSearch,
    searchResults,
    listTipsByRegion,
    getEmergencyContacts,
    suggestCountryPresets,
  }), [loaded, regions, categories, query, category, severity, doSearch, searchResults, listTipsByRegion, getEmergencyContacts, suggestCountryPresets]);

  return (
    <SafetyContext.Provider value={value}>
      <div aria-live="polite" aria-atomic="true" className="sr-only">{liveMsg}</div>
      {children}
    </SafetyContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useSafety() {
  /** Hook to consume Safety context. */
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error('useSafety must be used within SafetyProvider');
  return ctx;
}
