import { getDictionaries } from '../language/LanguageContext';

/**
 * PhrasebookService
 * Provides in-memory phrasebook data and helper methods.
 * TODO: In future, switch to backend using REACT_APP_BACKEND_URL for dynamic content.
 */

const categories = [
  { id: 'greetings', labelKey: 'greetings' },
  { id: 'directions', labelKey: 'directions' },
  { id: 'dining', labelKey: 'dining' },
  { id: 'emergencies', labelKey: 'emergencies' },
  { id: 'money', labelKey: 'money' },
];

// Minimal language list derived from dictionaries
function listLanguages() {
  const dicts = getDictionaries();
  return Object.entries(dicts).map(([code, d]) => ({
    code, name: d.meta?.name || code, nativeName: d.meta?.nativeName || d.meta?.name || code
  }));
}

// Sample in-memory phrases by category and language
const phrases = [
  // Greetings
  {
    id: 'hello',
    category: 'greetings',
    meaningEn: 'Hello',
    translations: {
      en: { text: 'Hello', transliteration: null },
      es: { text: 'Hola', transliteration: null },
      fr: { text: 'Bonjour', transliteration: null },
      hi: { text: 'नमस्ते', transliteration: 'Namaste' },
      ja: { text: 'こんにちは', transliteration: 'Konnichiwa' },
    }
  },
  {
    id: 'thank_you',
    category: 'greetings',
    meaningEn: 'Thank you',
    translations: {
      en: { text: 'Thank you', transliteration: null },
      es: { text: 'Gracias', transliteration: null },
      fr: { text: 'Merci', transliteration: null },
      hi: { text: 'धन्यवाद', transliteration: 'Dhanyavaad' },
      ja: { text: 'ありがとう', transliteration: 'Arigatou' },
    }
  },
  // Directions
  {
    id: 'where_is_bathroom',
    category: 'directions',
    meaningEn: 'Where is the bathroom?',
    translations: {
      en: { text: 'Where is the bathroom?', transliteration: null },
      es: { text: '¿Dónde está el baño?', transliteration: null },
      fr: { text: 'Où sont les toilettes ?', transliteration: null },
      hi: { text: 'शौचालय कहाँ है?', transliteration: 'Shauchalay kahan hai?' },
      ja: { text: 'トイレはどこですか？', transliteration: 'Toire wa doko desu ka?' },
    }
  },
  // Dining
  {
    id: 'water_please',
    category: 'dining',
    meaningEn: 'Water, please',
    translations: {
      en: { text: 'Water, please', transliteration: null },
      es: { text: 'Agua, por favor', transliteration: null },
      fr: { text: 'De l’eau, s’il vous plaît', transliteration: null },
      hi: { text: 'पानी, कृपया', transliteration: 'Paani, kripya' },
      ja: { text: 'お水をお願いします', transliteration: 'Omizu o onegai shimasu' },
    }
  },
  // Emergencies
  {
    id: 'help',
    category: 'emergencies',
    meaningEn: 'Help!',
    translations: {
      en: { text: 'Help!', transliteration: null },
      es: { text: '¡Ayuda!', transliteration: null },
      fr: { text: 'À l’aide !', transliteration: null },
      hi: { text: 'मदद!', transliteration: 'Madad!' },
      ja: { text: '助けて！', transliteration: 'Tasukete!' },
    }
  },
  // Money
  {
    id: 'how_much',
    category: 'money',
    meaningEn: 'How much is this?',
    translations: {
      en: { text: 'How much is this?', transliteration: null },
      es: { text: '¿Cuánto cuesta esto?', transliteration: null },
      fr: { text: 'Combien ça coûte ?', transliteration: null },
      hi: { text: 'यह कितने का है?', transliteration: 'Yah kitne ka hai?' },
      ja: { text: 'これはいくらですか？', transliteration: 'Kore wa ikura desu ka?' },
    }
  },
];

// PUBLIC_INTERFACE
export function listCategories() {
  /** Returns list of categories */
  return [...categories];
}

// PUBLIC_INTERFACE
export function listPhrases({ language = 'en', category = null, search = '' } = {}) {
  /**
   * Returns phrases filtered by language, category, and search.
   * Each item: { id, category, meaningEn, text, transliteration }
   */
  const q = search.trim().toLowerCase();
  return phrases
    .filter(p => !category || p.category === category)
    .map(p => {
      const tr = p.translations[language] || p.translations.en;
      return {
        id: p.id,
        category: p.category,
        meaningEn: p.meaningEn,
        text: tr.text,
        transliteration: tr.transliteration
      };
    })
    .filter(p => {
      if (!q) return true;
      return (
        p.meaningEn.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q) ||
        (p.transliteration ? p.transliteration.toLowerCase().includes(q) : false)
      );
    });
}

// PUBLIC_INTERFACE
export function listAvailableLanguages() {
  /** Returns supported languages list derived from dictionaries */
  return listLanguages();
}

// PUBLIC_INTERFACE
export function getFeaturedPhrases(language = 'en', max = 4) {
  /** Returns a small set of phrases to feature on the Language Hub */
  return listPhrases({ language }).slice(0, max);
}

// Future integration note
// TODO: Replace with asynchronous fetches from `${process.env.REACT_APP_BACKEND_URL}/phrasebook/...` when backend is ready.
