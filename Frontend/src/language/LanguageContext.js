import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Language dictionaries for UI strings and basic phrase translations.
 * Structure:
 *  - ui: common UI labels
 *  - phrasebook: generic phrases for mini translator stub lookup
 */
const dictionaries = {
  en: {
    meta: { name: 'English', nativeName: 'English' },
    ui: {
      language: 'Language',
      selectLanguage: 'Select language',
      translator: 'Mini Translator',
      translate: 'Translate',
      enterText: 'Enter text',
      targetLanguage: 'Target language',
      copied: 'Copied!',
      copy: 'Copy',
      pronounce: 'Play',
      phrasebook: 'Phrasebook',
      categories: 'Categories',
      all: 'All',
      search: 'Search',
      featuredPhrases: 'Featured Phrases',
      greetings: 'Greetings',
      directions: 'Directions',
      dining: 'Dining',
      emergencies: 'Emergencies',
      money: 'Money',
      languageHub: 'Language Hub',
      viewAllPhrases: 'View all phrases'
    },
    phrasebook: {
      // MiniTranslator stub dictionary: key by English base form
      'hello': { es: 'hola', fr: 'bonjour', hi: 'नमस्ते', ja: 'こんにちは' },
      'thank you': { es: 'gracias', fr: 'merci', hi: 'धन्यवाद', ja: 'ありがとう' },
      'please': { es: 'por favor', fr: 's\'il vous plaît', hi: 'कृपया', ja: 'お願いします' },
      'where is the bathroom?': { es: '¿Dónde está el baño?', fr: 'Où sont les toilettes ?', hi: 'शौचालय कहाँ है?', ja: 'トイレはどこですか？' },
      'help': { es: 'ayuda', fr: 'à l\'aide', hi: 'मदद', ja: '助けて' },
    }
  },
  fr: {
    meta: { name: 'French', nativeName: 'Français' },
    ui: {
      language: 'Langue',
      selectLanguage: 'Choisir la langue',
      translator: 'Mini Traducteur',
      translate: 'Traduire',
      enterText: 'Saisir le texte',
      targetLanguage: 'Langue cible',
      copied: 'Copié !',
      copy: 'Copier',
      pronounce: 'Lire',
      phrasebook: 'Livre de phrases',
      categories: 'Catégories',
      all: 'Tous',
      search: 'Rechercher',
      featuredPhrases: 'Phrases à la une',
      greetings: 'Salutations',
      directions: 'Itinéraires',
      dining: 'Restauration',
      emergencies: 'Urgences',
      money: 'Argent',
      languageHub: 'Hub de Langues',
      viewAllPhrases: 'Voir toutes les phrases'
    },
    phrasebook: {}
  },
  es: {
    meta: { name: 'Spanish', nativeName: 'Español' },
    ui: {
      language: 'Idioma',
      selectLanguage: 'Seleccionar idioma',
      translator: 'Mini Traductor',
      translate: 'Traducir',
      enterText: 'Ingresar texto',
      targetLanguage: 'Idioma de destino',
      copied: '¡Copiado!',
      copy: 'Copiar',
      pronounce: 'Reproducir',
      phrasebook: 'Fraseario',
      categories: 'Categorías',
      all: 'Todos',
      search: 'Buscar',
      featuredPhrases: 'Frases destacadas',
      greetings: 'Saludos',
      directions: 'Direcciones',
      dining: 'Comidas',
      emergencies: 'Emergencias',
      money: 'Dinero',
      languageHub: 'Centro de Idiomas',
      viewAllPhrases: 'Ver todas las frases'
    },
    phrasebook: {}
  },
  hi: {
    meta: { name: 'Hindi', nativeName: 'हिन्दी' },
    ui: {
      language: 'भाषा',
      selectLanguage: 'भाषा चुनें',
      translator: 'मिनी अनुवादक',
      translate: 'अनुवाद करें',
      enterText: 'पाठ दर्ज करें',
      targetLanguage: 'लक्ष्य भाषा',
      copied: 'कॉपी किया गया!',
      copy: 'कॉपी',
      pronounce: 'चलाएँ',
      phrasebook: 'वाक्य पुस्तिका',
      categories: 'श्रेणियाँ',
      all: 'सभी',
      search: 'खोज',
      featuredPhrases: 'विशेष वाक्य',
      greetings: 'नमस्कार',
      directions: 'दिशाएँ',
      dining: 'भोजन',
      emergencies: 'आपातकाल',
      money: 'पैसा',
      languageHub: 'भाषा हब',
      viewAllPhrases: 'सभी वाक्य देखें'
    },
    phrasebook: {}
  },
  ja: {
    meta: { name: 'Japanese', nativeName: '日本語' },
    ui: {
      language: '言語',
      selectLanguage: '言語を選択',
      translator: 'ミニ翻訳',
      translate: '翻訳',
      enterText: 'テキストを入力',
      targetLanguage: 'ターゲット言語',
      copied: 'コピーしました！',
      copy: 'コピー',
      pronounce: '再生',
      phrasebook: 'フレーズ集',
      categories: 'カテゴリ',
      all: 'すべて',
      search: '検索',
      featuredPhrases: 'おすすめフレーズ',
      greetings: 'あいさつ',
      directions: '道案内',
      dining: '食事',
      emergencies: '緊急',
      money: 'お金',
      languageHub: '言語ハブ',
      viewAllPhrases: 'すべてのフレーズを見る'
    },
    phrasebook: {}
  }
};

const STORAGE_KEY = 'app.language';

const LanguageContext = createContext({
  lang: 'en',
  setLang: (_l) => {},
  t: (key) => key,
  availableLanguages: [],
  translateStub: (_text, _to) => null
});

// PUBLIC_INTERFACE
export function useLanguage() {
  /** Use Language context hook */
  return useContext(LanguageContext);
}

// PUBLIC_INTERFACE
export function LanguageProvider({ children }) {
  /**
   * Provides language state, translation helper t(), and a simple translateStub() for mini translator.
   * Persists the language selection to localStorage.
   */
  const [lang, setLangState] = useState(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    return stored || 'en';
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage failures
    }
  }, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
  }, []);

  const availableLanguages = useMemo(() => {
    return Object.entries(dictionaries).map(([code, d]) => ({
      code,
      name: d.meta?.name || code,
      nativeName: d.meta?.nativeName || d.meta?.name || code
    }));
  }, []);

  // PUBLIC_INTERFACE
  const t = useCallback((key) => {
    const parts = key.split('.');
    let obj = dictionaries[lang]?.ui;
    if (!obj) return key;
    for (const p of parts) {
      obj = obj?.[p];
      if (obj == null) return key;
    }
    return typeof obj === 'string' ? obj : key;
  }, [lang]);

  // PUBLIC_INTERFACE
  const translateStub = useCallback((text, toLang) => {
    if (!text || !toLang) return null;
    const base = text.trim().toLowerCase();
    const mappings = dictionaries.en.phrasebook[base];
    if (mappings && mappings[toLang]) {
      return mappings[toLang];
    }
    // Fallback: if asking English and it's in our base dictionary, return original
    if (toLang === 'en') {
      return base;
    }
    return null;
  }, []);

  const value = useMemo(() => ({
    lang,
    setLang,
    t,
    availableLanguages,
    translateStub
  }), [lang, setLang, t, availableLanguages, translateStub]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function getDictionaries() {
  /** Return dictionaries metadata for external use (e.g., PhrasebookService) */
  return dictionaries;
}
