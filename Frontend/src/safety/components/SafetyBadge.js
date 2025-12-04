// PUBLIC_INTERFACE
export default function SafetyBadge({ severity = 'low' }) {
  /** Renders a severity pill: low, medium, high */
  const sev = String(severity || 'low').toLowerCase();
  const label = sev.charAt(0).toUpperCase() + sev.slice(1);
  return (
    <span className={`sf-badge sf-badge--${sev}`} aria-label={`Severity: ${label}`}>
      {label}
    </span>
  );
}
