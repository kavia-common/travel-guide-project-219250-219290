import React from 'react';
import { useLanguage } from '../LanguageContext';
import { listCategories } from '../../services/PhrasebookService';
import '../../safety/components/SafetyComponents.css';

// PUBLIC_INTERFACE
export default function CategoryChips({ value, onChange, includeAll = true }) {
  /**
   * Renders chips for categories; uses existing chip styles from safety if available.
   */
  const { t } = useLanguage();
  const cats = listCategories();

  const Chip = ({ id, label, active }) => (
    <button
      className={`safety-chip ${active ? 'active' : ''}`}
      onClick={() => onChange(id)}
      aria-pressed={active}
      style={{ marginRight: 8, marginBottom: 8 }}
    >
      {label}
    </button>
  );

  return (
    <div role="listbox" aria-label={t('categories')} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {includeAll && (
        <Chip id={null} label={t('all')} active={value == null} />
      )}
      {cats.map(c => (
        <Chip key={c.id} id={c.id} label={t(c.labelKey)} active={value === c.id} />
      ))}
    </div>
  );
}
