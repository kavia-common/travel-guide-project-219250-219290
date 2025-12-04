import React, { useEffect, useRef, useState } from 'react';
import './Gallery.css';

/**
 * PUBLIC_INTERFACE
 * UploadWidget handles selecting an image, preview, caption, location and public toggle.
 * Props:
 * - onSubmit: ({ file, previewUrl, caption, location, isPublic, uploader }) => Promise<void> | void
 * - compact?: boolean
 */
export default function UploadWidget({ onSubmit, compact = false }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [uploader, setUploader] = useState('You');
  const [isPublic, setIsPublic] = useState(true);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const liveRef = useRef(null);

  useEffect(() => {
    if (!file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (status && liveRef.current) {
      liveRef.current.textContent = status;
      const t = setTimeout(() => { if (liveRef.current) liveRef.current.textContent = ''; }, 1500);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
    } else {
      setFile(null);
      setStatus('Please choose a valid image file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please choose an image to upload.');
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ file, previewUrl, caption, location, isPublic, uploader });
      // Reset
      setFile(null); setPreviewUrl(''); setCaption(''); setLocation('');
      setIsPublic(true);
      setStatus('Photo uploaded.');
    } catch (err) {
      setStatus(err?.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="gl-upload" aria-label="Upload a photo" style={{ display: 'grid', gap: 10 }}>
      <div aria-live="polite" aria-atomic="true" className="gl-sr" ref={liveRef} />

      <div style={{ display: 'grid', gap: 8 }}>
        <label htmlFor="photo-file"><strong>Choose image</strong></label>
        <input
          id="photo-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-describedby="photo-file-help"
        />
        <div id="photo-file-help" style={{ fontSize: 12, opacity: 0.8 }}>
          Supported: JPG, PNG, GIF. Preview appears after selection.
        </div>
      </div>

      {previewUrl && (
        <div>
          <img
            src={previewUrl}
            alt={caption ? `Preview: ${caption}` : 'Image preview'}
            style={{ maxWidth: '100%', borderRadius: 10, border: '1px solid var(--gl-border)' }}
          />
        </div>
      )}

      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="photo-caption">Caption</label>
        <input
          id="photo-caption"
          className="gl-input"
          type="text"
          placeholder="E.g., Sunset over the bay"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="photo-location">Destination/Location</label>
        <input
          id="photo-location"
          className="gl-input"
          type="text"
          placeholder="E.g., Santorini, Greece"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="photo-uploader">Your name</label>
        <input
          id="photo-uploader"
          className="gl-input"
          type="text"
          placeholder="E.g., Alex"
          value={uploader}
          onChange={(e) => setUploader(e.target.value)}
        />
      </div>

      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          aria-label="Make photo public/shareable"
        />
        Public/shareable
      </label>

      <div>
        <button type="submit" className="gl-btn gl-btn--primary" disabled={busy} aria-label="Upload photo">
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </form>
  );
}
