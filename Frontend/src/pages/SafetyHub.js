import React, { useEffect, useMemo, useState } from 'react';
import { Container } from '../components/SharedUI';
import '../components/SharedUI.css';
import '../App.css';
import { useSafety } from '../safety/SafetyContext';
import SafetySearchBar from '../safety/components/SafetySearchBar';
import TipsList from '../safety/components/TipsList';
import EmergencyContactsCard from '../safety/components/EmergencyContactsCard';
import CategoryChips from '../safety/components/CategoryChips';
import Notice from '../safety/components/Notice';
import '../safety/components/SafetyComponents.css';

/**
 * PUBLIC_INTERFACE
 * SafetyHub: Search safety tips, browse categories, and view emergency contacts panel.
 * Route: /safety
 */
export default function SafetyHub() {
  const {
    loaded, categories, regions,
    doSearch, searchResults,
    category, setCategory,
  } = useSafety();

  const [presets, setPresets] = useState([]);
  const [contacts, setContacts] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('US'); // default

  // Load presets, initial contacts, and default search using context APIs
  const { suggestCountryPresets, getEmergencyContacts: ctxGetContacts, doSearch: ctxDoSearch } = useSafety();

  useEffect(() => {
    let active = true;
    (async () => {
      if (!loaded) return;
      const ps = await suggestCountryPresets();
      if (!active) return;
      setPresets(ps);
      const initialCode = (ps.find(p => p.regionCode === 'US')?.regionCode) || ps[0]?.regionCode;
      if (initialCode) {
        setSelectedRegion(initialCode);
        const c = await ctxGetContacts(initialCode);
        if (active) setContacts(c);
      }
      await ctxDoSearch('');
    })();
    return () => { active = false; };
  }, [loaded, suggestCountryPresets, ctxGetContacts, ctxDoSearch]);

  // When user changes region via quick selector, update contacts
  const onRegionChange = async (code) => {
    setSelectedRegion(code);
    const c = await ctxGetContacts(code);
    setContacts(c);
  };

  const onSearch = async ({ query, regionCode, category: cat, severity }) => {
    await ctxDoSearch(query, { category: cat, severity });
    if (regionCode) {
      await onRegionChange(regionCode);
    }
  };

  const headerSub = useMemo(() => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 14, opacity: 0.8 }}>Quick region:</span>
      <div role="group" aria-label="Quick country selection" style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap' }}>
        {presets.map((p) => (
          <button
            key={p.regionCode}
            type="button"
            className={`sf-chip ${p.regionCode === selectedRegion ? 'is-active' : ''}`}
            onClick={() => onRegionChange(p.regionCode)}
            aria-pressed={p.regionCode === selectedRegion}
            aria-label={`Select ${p.name}`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  ), [presets, selectedRegion]);

  return (
    <section role="region" aria-label="Travel safety hub">
      <Container className="tg-section">
        <div style={{ display: 'grid', gap: 6 }}>
          <h1 className="tg-section__title" style={{ marginBottom: 0 }}>Travel Tips & Safety</h1>
          <p className="tg-section__subtitle" style={{ marginTop: 0 }}>
            Search local tips, avoid common scams, and keep emergency numbers handy.
          </p>
        </div>

        <Notice>
          Remember: In the EU you can dial 112 for emergencies. In the U.S. call 911.
        </Notice>

        <SafetySearchBar presets={regions} onSearch={onSearch} />

        <div className="sf-grid">
          <div>
            <CategoryChips
              categories={categories}
              value={category}
              onChange={(c) => setCategory(c)}
            />
            <TipsList tips={searchResults} />
          </div>
          <div>
            <EmergencyContactsCard contacts={contacts} />
            {headerSub}
          </div>
        </div>
      </Container>
    </section>
  );
}
