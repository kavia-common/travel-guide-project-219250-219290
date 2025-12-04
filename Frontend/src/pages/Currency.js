import React from 'react';
import { Container } from '../components/SharedUI';
import '../components/SharedUI.css';
import '../App.css';
import CurrencyConverterWidget from '../components/CurrencyConverterWidget';

/**
 * PUBLIC_INTERFACE
 * Currency converter page at /currency.
 * Renders the converter widget in a page layout.
 */
export default function CurrencyPage() {
  return (
    <section role="region" aria-label="Currency converter">
      <Container className="tg-section">
        <h1 className="tg-section__title">Currency Converter</h1>
        <p className="tg-section__subtitle">Quickly convert between popular currencies. Rates shown are sample values for demonstration.</p>

        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr' }}>
          <CurrencyConverterWidget />
        </div>
      </Container>
    </section>
  );
}
