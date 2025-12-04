import React, { useMemo, useState } from 'react';
import { useLanguage } from '../language/LanguageContext';
import { listAvailableLanguages, listPhrases } from '../services/PhrasebookService';
import CategoryChips from '../language/components/CategoryChips';
import PhraseCard from '../language/components/PhraseCard';

// PUBLIC_INTERFACE
export default function Phrasebook() {
  /** Phrasebook page with language and category filters and a search box */
  const { t, lang } = useLanguage();
  const [language, setLanguage] = useState(lang);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');

  const languages = useMemo(() => listAvailableLanguages(), []);
  const phrases = useMemo(() => listPhrases({ language, category, search }), [language, category, search]);

  return (
    <div className="container" style={{ padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>{t('phrasebook')}</h1>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr', marginBottom: 16 }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{t('language')}</span>
          <select aria-label={t('language')} value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>
            ))}
          </select>
        </label>
        <CategoryChips value={category} onChange={setCategory} includeAll />
        <label>
          <span className="sr-only">{t('search')}</span>
          <input
            type="search"
            aria-label={t('search')}
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 12
      }}>
        {phrases.map(p => (<PhraseCard key={p.id} phrase={p} />))}
      </div>
    </div>
  );
}
