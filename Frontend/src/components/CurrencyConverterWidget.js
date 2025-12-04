import React, { useEffect, useMemo, useRef, useState } from 'react';
import './CurrencyConverterWidget.css';
import RatesService from '../services/RatesService';

/**
 * PUBLIC_INTERFACE
 * A compact, accessible currency converter widget.
 * Props:
 * - initialAmount?: number
 * - initialFrom?: string
 * - initialTo?: string
 * - className?: string
 * - compact?: boolean (styling hint)
 */
export default function CurrencyConverterWidget({
  initialAmount = 100,
  initialFrom = 'USD',
  initialTo = 'EUR',
  className = '',
  compact = false,
}) {
  const serviceRef = useRef(new RatesService());
  const [amount, setAmount] = useState(String(initialAmount));
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const liveRef = useRef(null);

  const popular = useMemo(() => serviceRef.current.getPopularCurrencies(), []);

  // Example "search" within selects via datalist-like approach: we keep selects but allow typing filter by native UA.
  // To make it simple without extra libs, we just render options for popular + all from popular list.

  const onSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const onPresetClick = (code) => {
    setTo(code);
  };

  const validate = () => {
    const n = Number(amount);
    if (amount === '' || Number.isNaN(n)) {
      return 'Please enter a valid amount.';
    }
    if (n < 0) {
      return 'Amount cannot be negative.';
    }
    if (!from) return 'Please choose a from-currency.';
    if (!to) return 'Please choose a to-currency.';
    return '';
  };

  const doConvert = async (e) => {
    e?.preventDefault?.();
    const v = validate();
    setError(v);
    if (v) return;

    setBusy(true);
    try {
      const n = Number(amount);
      const { result: out, rate, inverseRate, updatedAt } = await serviceRef.current.convert(n, from, to);
      setResult({ value: out, rate, inverseRate, updatedAt });
    } catch (err) {
      setError(err.message || 'Conversion error.');
    } finally {
      setBusy(false);
    }
  };

  // Announce changes for screen readers
  useEffect(() => {
    if (result && liveRef.current) {
      const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(result.value);
      liveRef.current.textContent = `Converted result: ${formatted} ${to}. Rate: 1 ${from} equals ${result.rate.toFixed(6)} ${to}.`;
    }
  }, [result, from, to]);

  // Do an initial conversion on mount
  useEffect(() => {
    doConvert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const presetCodes = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

  // Common pairs for mini table
  const commonPairs = useMemo(() => ([
    `${from}_USD`,
    `${from}_EUR`,
    `${from}_GBP`,
    `${from}_JPY`,
    `${from}_AUD`,
    `${from}_CAD`,
  ]), [from]);

  const [pairRates, setPairRates] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rates = await serviceRef.current.getRatesForPairs(commonPairs);
        if (active) setPairRates(rates);
      } catch {
        if (active) setPairRates([]);
      }
    })();
    return () => { active = false; };
  }, [commonPairs]);

  return (
    <section className={`ccw ${compact ? 'ccw--compact' : ''} ${className}`} aria-label="Currency converter">
      <h2 className="ccw__title">Currency Converter</h2>

      <form className="ccw__grid" onSubmit={doConvert} noValidate>
        <div className="ccw__field">
          <label className="ccw__label" htmlFor="ccw-amount">Amount</label>
          <input
            id="ccw-amount"
            className="ccw__input"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="ccw__field">
          <label className="ccw__label" htmlFor="ccw-from">From</label>
          <select
            id="ccw-from"
            className="ccw__select"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From currency"
            required
          >
            {popular.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>

        <div className="ccw__field">
          <label className="ccw__label" htmlFor="ccw-to">To</label>
          <select
            id="ccw-to"
            className="ccw__select"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To currency"
            required
          >
            {popular.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>

        <div className="ccw__field ccw__submit">
          <button type="submit" className="ccw__btn" aria-label="Convert currency now" disabled={busy}>
            {busy ? 'Converting…' : 'Convert'}
          </button>
        </div>
      </form>

      <div className="ccw__presets" role="group" aria-label="Popular to-currency presets">
        <span className="ccw__label" aria-hidden="true">Quick presets:</span>
        {presetCodes.map((c) => (
          <button
            key={c}
            type="button"
            className="ccw__chip"
            onClick={() => onPresetClick(c)}
            aria-label={`Set To currency to ${c}`}
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          className="ccw__chip"
          onClick={onSwap}
          aria-label="Swap from and to currencies"
          title="Swap"
        >
          ⇄ Swap
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{ color: 'crimson', fontSize: 13 }}
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <div className="ccw__result" aria-live="polite" aria-atomic="true" ref={liveRef}>
        {result ? (
          <>
            <div className="ccw__result-main">
              {new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(Number(amount))} {from}
              {' = '}
              {new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(result.value)} {to}
            </div>
            <div className="ccw__result-sub">
              Rate: 1 {from} = {result.rate.toFixed(6)} {to} • Inverse: 1 {to} = {result.inverseRate.toFixed(6)} {from}
              {result.updatedAt ? ` • Updated: ${new Date(result.updatedAt).toLocaleString()}` : ''}
            </div>
          </>
        ) : (
          <div className="ccw__result-sub">Enter an amount and convert to see results.</div>
        )}
      </div>

      <div>
        <h3 style={{ margin: '8px 0 6px 0', fontSize: 14, fontWeight: 800 }}>Common rates from {from}</h3>
        <table className="ccw__rates" aria-label={`Common exchange rates from ${from}`}>
          <thead>
            <tr>
              <th scope="col">Pair</th>
              <th scope="col">Rate (1 {from} ->)</th>
            </tr>
          </thead>
          <tbody>
            {pairRates.length === 0 && (
              <tr>
                <td colSpan="2" style={{ fontSize: 13, color: 'var(--cc-muted)' }}>Loading rates…</td>
              </tr>
            )}
            {pairRates.map((r) => {
              const [, toCode] = r.pair.split('_');
              return (
                <tr key={r.pair}>
                  <td>{from}/{toCode}</td>
                  <td>{r.rate.toFixed(6)} {toCode}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
