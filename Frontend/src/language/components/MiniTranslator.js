import React, { useMemo, useState } from 'react';
import { useLanguage } from '../LanguageContext';

// PUBLIC_INTERFACE
export default function MiniTranslator({ compact = false }) {
  /**
   * Mini Translator using translateStub from LanguageContext.
   * Not using any external APIs.
   */
  const { t, availableLanguages, translateStub, lang } = useLanguage();
  const [text, setText] = useState('');
  const [target, setTarget] = useState('es');
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');

  const langs = useMemo(() => availableLanguages, [availableLanguages]);

  const onTranslate = () => {
    const res = translateStub(text, target);
    if (res) {
      setResult(res);
      setMessage('');
    } else {
      setResult('');
      setMessage('No translation found in stub dictionary.');
    }
  };

  return (
    <div className="mini-translator" style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
      {!compact && <h3 style={{ margin: 0, marginBottom: 8 }}>{t('translator')}</h3>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
        <label>
          <span className="sr-only">{t('enterText')}</span>
          <input
            type="text"
            aria-label={t('enterText')}
            placeholder={t('enterText')}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{t('targetLanguage')}</span>
          <select aria-label={t('targetLanguage')} value={target} onChange={(e) => setTarget(e.target.value)}>
            {langs.filter(l => l.code !== lang).map(l => (
              <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>
            ))}
          </select>
        </label>
        <div>
          <button onClick={onTranslate}>{t('translate')}</button>
        </div>
        <div aria-live="polite" style={{ minHeight: 20, color: result ? '#111827' : '#ef4444' }}>
          {result || message}
        </div>
      </div>
    </div>
  );
}
