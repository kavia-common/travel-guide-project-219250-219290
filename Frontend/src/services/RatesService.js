/**
 * PUBLIC_INTERFACE
 * Provides an abstraction over exchange rate fetching and conversion.
 * Currently uses a stubbed provider with sample static rates.
 * TODO: Replace StubRatesProvider with a real provider (backend or third-party API).
 */

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'CHF', name: 'Swiss Franc' },
];

/**
 * A default stub provider with hard-coded base rates relative to USD.
 * The shape mimics what a real provider would return to ease future swap.
 */
class StubRatesProvider {
  constructor() {
    this.base = 'USD';
    this.sample = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.78,
      JPY: 148.5,
      AUD: 1.48,
      CAD: 1.36,
      INR: 83.2,
      CNY: 7.13,
      CHF: 0.86,
    };
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Returns a normalized rates object using USD as the implicit base.
   * @returns {{base: string, rates: Record<string, number>, updatedAt: string}}
   */
  async fetchRates() {
    // Simulate async delay
    await new Promise((r) => setTimeout(r, 120));
    return {
      base: this.base,
      rates: { ...this.sample },
      updatedAt: this.updatedAt,
    };
  }
}

/**
 * PUBLIC_INTERFACE
 * Main service with pluggable provider.
 */
export class RatesService {
  /**
   * @param {object} provider An object implementing fetchRates(): Promise<{base: string, rates: Record<string, number>, updatedAt: string}>
   */
  constructor(provider = new StubRatesProvider()) {
    this.provider = provider;
    this.cache = null;
    this.cacheTimeMs = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get available/popular currencies for UI selects.
   * @returns {{code: string, name: string}[]}
   */
  // PUBLIC_INTERFACE
  getPopularCurrencies() {
    /** Returns a curated list of popular currency codes and names for UI presets. */
    return POPULAR_CURRENCIES;
  }

  async _getRatesCached() {
    const now = Date.now();
    if (this.cache && now - this.cache.loadedAt < this.cacheTimeMs) {
      return this.cache.data;
    }
    const data = await this.provider.fetchRates();
    this.cache = { data, loadedAt: now };
    return data;
  }

  /**
   * Convert an amount between currencies using the provider's rates.
   * @param {number} amount
   * @param {string} from
   * @param {string} to
   * @returns {{ result: number, rate: number, inverseRate: number, updatedAt: string }}
   */
  // PUBLIC_INTERFACE
  async convert(amount, from, to) {
    /** Converts amount from one currency to another using cached rates. Includes direct and inverse rates. */
    if (Number.isNaN(amount) || !Number.isFinite(amount)) {
      throw new Error('Invalid amount');
    }
    if (!from || !to) {
      throw new Error('Both from and to currencies are required');
    }
    const { base, rates, updatedAt } = await this._getRatesCached();

    // Normalize: convert from->USD then USD->to (or base->to if different base)
    const getToUSD = (code) => {
      if (code === base) return 1;
      if (!rates[code]) throw new Error(`Unsupported currency: ${code}`);
      // rates[code] = how many code per 1 USD, or how many per USD? We set sample as 1 USD = rates[code] code
      // To go from code to USD: amount_code / rates[code]
      return 1 / rates[code];
    };

    const getUSDto = (code) => {
      if (code === base) return 1;
      if (!rates[code]) throw new Error(`Unsupported currency: ${code}`);
      return rates[code]; // 1 USD -> code
    };

    const amountInUSD = amount * getToUSD(from);
    const result = amountInUSD * getUSDto(to);

    // Direct rate (1 from -> ? to)
    const rate = getToUSD(from) * getUSDto(to);
    const inverseRate = rate === 0 ? 0 : 1 / rate;

    return {
      result,
      rate,
      inverseRate,
      updatedAt,
    };
  }

  /**
   * Get a compact matrix of common pairs for quick glance.
   * @param {string[]} pairs array of "FROM_TO" like ["USD_EUR","EUR_GBP"]
   * @returns {Promise<Array<{pair: string, rate: number}>>}
   */
  // PUBLIC_INTERFACE
  async getRatesForPairs(pairs) {
    /** Returns direct rate for each requested pair string. */
    const out = [];
    for (const p of pairs) {
      const [from, to] = p.split('_');
      const { rate } = await this.convert(1, from, to);
      out.push({ pair: p, rate });
    }
    return out;
  }
}

export default RatesService;
