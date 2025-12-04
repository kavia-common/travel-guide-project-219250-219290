import React, { useEffect, useRef, useState } from 'react';
import './SafetyComponents.css';

// PUBLIC_INTERFACE
export default function EmergencyContactsCard({ contacts, title = 'Emergency Contacts' }) {
  /**
   * Displays emergency contacts with copy-to-clipboard and tel: call links.
   * contacts: { police, ambulance, fire, note, embassy: { phone, address, website }, regionName? }
   */
  const [liveMsg, setLiveMsg] = useState('');
  const liveRef = useRef(null);

  useEffect(() => {
    if (liveMsg && liveRef.current) {
      liveRef.current.textContent = liveMsg;
      const t = setTimeout(() => { if (liveRef.current) liveRef.current.textContent = ''; }, 1200);
      return () => clearTimeout(t);
    }
  }, [liveMsg]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text || ''));
      setLiveMsg('Copied to clipboard');
    } catch {
      setLiveMsg('Copy failed');
    }
  };

  const Row = ({ label, value }) => (
    <div className="sf-contacts__row">
      <div><strong>{label}:</strong> {value || '—'}</div>
      <div style={{ display: 'inline-flex', gap: 6 }}>
        {value && <a className="sf-contacts__call" href={`tel:${value}`} aria-label={`Call ${label}`}>Call</a>}
        <button type="button" className="sf-contacts__btn" onClick={() => copy(value)} aria-label={`Copy ${label} number`}>Copy</button>
      </div>
    </div>
  );

  return (
    <aside className="sf-contacts" aria-label="Emergency contacts">
      <div className="sr-only" aria-live="polite" aria-atomic="true" ref={liveRef} />
      <h3 style={{ margin: '0 0 8px 0' }}>{title}{contacts?.regionName ? ` — ${contacts.regionName}` : ''}</h3>
      <Row label="Police" value={contacts?.police} />
      <Row label="Ambulance" value={contacts?.ambulance} />
      <Row label="Fire" value={contacts?.fire} />
      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>{contacts?.note}</div>
      <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px dashed var(--sf-border)' }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Embassy/Consulate (placeholder)</div>
        <div style={{ fontSize: 14 }}>
          <div>Phone: {contacts?.embassy?.phone || '—'}</div>
          <div>Address: {contacts?.embassy?.address || '—'}</div>
          <div>Website: {contacts?.embassy?.website || '—'}</div>
        </div>
      </div>
    </aside>
  );
}
