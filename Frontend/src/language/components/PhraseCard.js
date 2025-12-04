import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

// PUBLIC_INTERFACE
export default function PhraseCard({ phrase }) {
  /**
   * Shows a phrase with transliteration and English meaning.
   * Includes copy button with aria-live feedback and pronounce stub.
   */
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(phrase.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const onPronounce = () => {
    // Stub for future TTS integration
    // TODO: integrate Web Speech API or backend TTS
  };

  return (
    <div className="phrase-card" style={{ border: '1px solid #e5e7eb', padding: '12px', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{phrase.text}</div>
          {phrase.transliteration && (
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{phrase.transliteration}</div>
          )}
          <div style={{ color: '#374151', marginTop: 4 }}>{phrase.meaningEn}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCopy} aria-live="polite" aria-label={t('copy')}>
            {t('copy')}
          </button>
          <button onClick={onPronounce} aria-label={t('pronounce')}>
            {t('pronounce')}
          </button>
        </div>
      </div>
      <div aria-live="polite" style={{ fontSize: '0.8rem', color: '#10b981', height: 18, marginTop: 6 }}>
        {copied ? t('copied') : ''}
      </div>
    </div>
  );
}
