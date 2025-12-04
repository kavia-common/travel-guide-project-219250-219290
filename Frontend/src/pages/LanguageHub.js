import React from 'react';
import LanguageSelector from '../language/components/LanguageSelector';
import MiniTranslator from '../language/components/MiniTranslator';
import PhraseCard from '../language/components/PhraseCard';
import { useLanguage } from '../language/LanguageContext';
import { getFeaturedPhrases } from '../services/PhrasebookService';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function LanguageHub() {
  /** Language Hub page including selector, mini translator, and featured phrases */
  const { t, lang } = useLanguage();
  const featured = getFeaturedPhrases(lang, 4);

  return (
    <div className="container" style={{ padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>{t('languageHub')}</h1>
      <div style={{ marginBottom: 16 }}>
        <LanguageSelector />
      </div>
      <div style={{ marginBottom: 24 }}>
        <MiniTranslator />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ margin: 0 }}>{t('featuredPhrases')}</h2>
        <Link to="/phrasebook">{t('viewAllPhrases')}</Link>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 12,
        marginTop: 12
      }}>
        {featured.map(p => (<PhraseCard key={p.id} phrase={p} />))}
      </div>
    </div>
  );
}
