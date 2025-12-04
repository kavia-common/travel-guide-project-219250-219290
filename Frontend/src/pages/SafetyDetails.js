import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../components/SharedUI';
import '../components/SharedUI.css';
import '../App.css';
import { useSafety } from '../safety/SafetyContext';
import CategoryChips from '../safety/components/CategoryChips';
import TipsList from '../safety/components/TipsList';
import EmergencyContactsCard from '../safety/components/EmergencyContactsCard';
import Notice from '../safety/components/Notice';
import '../safety/components/SafetyComponents.css';

/**
 * PUBLIC_INTERFACE
 * SafetyDetails: Region-specific safety info and emergency contacts.
 * Route: /safety/:regionCode
 */
export default function SafetyDetails() {
  const { regionCode } = useParams();
  const { categories, listTipsByRegion, getEmergencyContacts, category, setCategory } = useSafety();

  const [tips, setTips] = useState([]);
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [t, c] = await Promise.all([
        listTipsByRegion(regionCode, { category }),
        getEmergencyContacts(regionCode),
      ]);
      if (!active) return;
      setTips(t);
      setContacts(c);
    })();
    return () => { active = false; };
  }, [regionCode, category, listTipsByRegion, getEmergencyContacts]);

  const title = useMemo(() => {
    const name = contacts?.regionName || regionCode;
    return `Safety in ${name}`;
  }, [contacts, regionCode]);

  return (
    <section role="region" aria-label={`Safety details for ${contacts?.regionName || regionCode}`}>
      <Container className="tg-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <h1 className="tg-section__title" style={{ marginBottom: 6 }}>{title}</h1>
            <p className="tg-section__subtitle" style={{ marginTop: 0 }}>
              Region-specific tips and emergency contact information.
            </p>
          </div>
          <div>
            <Link to="/safety" className="tg-btn" aria-label="Back to Safety hub">← Back</Link>
          </div>
        </div>

        <Notice>
          For life-threatening emergencies, call the listed local number immediately. 112 works across the EU.
        </Notice>

        <div className="sf-grid" style={{ marginTop: 12 }}>
          <div>
            <CategoryChips
              categories={categories}
              value={category}
              onChange={(c) => setCategory(c)}
            />
            <TipsList tips={tips} />
          </div>
          <div>
            <EmergencyContactsCard contacts={contacts || {}} />
          </div>
        </div>
      </Container>
    </section>
  );
}
