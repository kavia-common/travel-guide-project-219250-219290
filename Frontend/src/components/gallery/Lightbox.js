import React, { useEffect, useMemo, useRef } from 'react';
import './Gallery.css';

/**
 * PUBLIC_INTERFACE
 * Lightbox modal for viewing a photo with keyboard navigation.
 * Props:
 * - photos: Photo[]
 * - currentId: string
 * - onClose: () => void
 * - onPrev: () => void
 * - onNext: () => void
 * - onCopyLink: (id: string) => void
 */
export default function Lightbox({ photos, currentId, onClose, onPrev, onNext, onCopyLink }) {
  const photoIndex = useMemo(() => photos.findIndex((p) => p.id === currentId), [photos, currentId]);
  const photo = photos[photoIndex] || null;
  const dialogRef = useRef(null);

  // Focus trapping and key handlers
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const prev = document.activeElement;
    // Focus dialog on mount
    dialogRef.current?.focus();
    return () => {
      // Restore focus
      prev?.focus?.();
    };
  }, []);

  if (!photo) return null;

  const { id, url, caption, location, uploader, isPublic } = photo;

  const onBackdropClick = (e) => {
    // Close when clicking backdrop only
    if (e.target.getAttribute('role') === 'dialog') {
      onClose();
    }
  };

  return (
    <div className="gl-lightbox" role="presentation" aria-hidden={false}>
      <div
        className="gl-lightbox__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        aria-describedby="lightbox-desc"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={onBackdropClick}
      >
        <div className="gl-lightbox__header">
          <h2 id="lightbox-title" className="gl-lightbox__title">
            {caption || 'Photo'}
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="gl-btn" onClick={onPrev} aria-label="Previous photo">←</button>
            <button className="gl-btn" onClick={onNext} aria-label="Next photo">→</button>
            <button className="gl-btn" onClick={() => onCopyLink(id)} aria-label="Copy share link">Copy link</button>
            <button className="gl-btn" onClick={onClose} aria-label="Close viewer">Close ✕</button>
          </div>
        </div>
        <div id="lightbox-desc" className="gl-lightbox__content">
          <div className="gl-lightbox__imgwrap">
            <img className="gl-lightbox__img" src={url} alt={caption ? `${caption} — ${location}` : `Photo from ${location}`} />
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            <div style={{ fontWeight: 700 }}>{caption || 'Untitled'}</div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              📍 {location || 'Unknown'} • 👤 {uploader || 'Guest'} {isPublic ? '' : '• 🔒 Private'}
            </div>
          </div>
          <div className="gl-lightbox__footer">
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Tip: Use ← and → to navigate, Esc to close.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="gl-btn" onClick={onPrev} aria-label="Previous photo">Previous</button>
              <button className="gl-btn" onClick={onNext} aria-label="Next photo">Next</button>
              <button className="gl-btn" onClick={() => onCopyLink(id)} aria-label="Copy share link">Copy link</button>
              <button className="gl-btn" onClick={onClose} aria-label="Close viewer">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
