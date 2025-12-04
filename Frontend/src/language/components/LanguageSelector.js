import React from 'react';
import { useLanguage } from '../LanguageContext';

// PUBLIC_INTERFACE
export default function LanguageSelector({ id = 'language-selector', compact = false }) {
  /**
   * Accessible language selector dropdown
   */
  const { lang, setLang, availableLanguages, t } = useLanguage();

  return (
    <label htmlFor={id} className="language-selector" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      {!compact && <span>{t('selectLanguage')}</span>}
      <select
        id={id}
        aria-label={t('selectLanguage')}
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        {availableLanguages.map(l => (
          <option key={l.code} value={l.code}>
            {l.nativeName} ({l.name})
          </option>
        ))}
      </select>
    </label>
  );
}
