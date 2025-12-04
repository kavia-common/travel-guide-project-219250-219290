import React from 'react';
import './Gallery.css';

/**
 * PUBLIC_INTERFACE
 * PhotoCard displays an image with caption, location, uploader and actions.
 */
export default function PhotoCard({ photo, onOpen, onCopyLink }) {
  const { id, url, caption, location, uploader, isPublic } = photo;
  const alt = caption ? `${caption} — ${location}` : `Photo from ${location}`;

  return (
    <article className="gl-card" aria-label={caption || 'Photo'}>
      <div className="gl-card__media">
        <img
          className="gl-card__img"
          src={url}
          alt={alt}
          loading="lazy"
          onClick={() => onOpen(id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(id); } }}
          aria-label={`Open ${caption || 'photo'} in viewer`}
        />
      </div>
      <div className="gl-card__body">
        <div>
          <strong style={{ display: 'block' }}>{caption || 'Untitled'}</strong>
          <div className="gl-card__meta">
            <span aria-label={`Location: ${location}`}>📍 {location || 'Unknown'}</span>
            <span aria-label={`Uploaded by ${uploader}`}>• 👤 {uploader || 'Guest'}</span>
            {!isPublic && <span aria-label="Private photo">• 🔒 Private</span>}
          </div>
        </div>
        <div className="gl-actions">
          <button className="gl-btn" onClick={() => onOpen(id)} aria-label="Open photo">
            View
          </button>
          <button className="gl-btn" onClick={() => onCopyLink(id)} aria-label="Copy share link">
            Copy link
          </button>
        </div>
      </div>
    </article>
  );
}
