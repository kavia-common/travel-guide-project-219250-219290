// PUBLIC_INTERFACE
export default function Notice({ children }) {
  /** Small advisory/notice box. */
  return (
    <div className="sf-notice" role="note" aria-live="polite">
      {children}
    </div>
  );
}
