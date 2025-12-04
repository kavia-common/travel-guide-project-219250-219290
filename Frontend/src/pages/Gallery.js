import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container } from '../components/SharedUI';
import '../components/SharedUI.css';
import '../components/Header.css';
import '../App.css';
import PhotoCard from '../components/gallery/PhotoCard';
import Lightbox from '../components/gallery/Lightbox';
import './GalleryPage.css'; // dedicated page style wrapper
import { usePhotos } from '../photos/PhotosContext';

/**
 * PUBLIC_INTERFACE
 * Gallery page: responsive grid of photos with search/filter and lightbox.
 */
export default function GalleryPage() {
  const { photos, getShareUrl } = usePhotos();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('all');
  const [currentId, setCurrentId] = useState(null);
  const [liveMsg, setLiveMsg] = useState('');
  const liveRef = useRef(null);

  // Prefill lightbox from route param if navigated via share link
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.photoId) {
      // Only open if the id exists in current photos
      const exists = photos.find((p) => p.id === params.photoId);
      if (exists) setCurrentId(params.photoId);
    }
  }, [params.photoId, photos]);

  const locations = useMemo(() => {
    const set = new Set(photos.map((p) => p.location).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [photos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return photos.filter((p) => {
      const locOk = location === 'all' || (p.location || '').toLowerCase() === location.toLowerCase();
      const qOk = !q ||
        (p.caption && p.caption.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.uploader && p.uploader.toLowerCase().includes(q));
      return locOk && qOk;
    });
  }, [photos, query, location]);

  const open = (id) => {
    setCurrentId(id);
    // Update route for shareable in-app link
    navigate(`/gallery/${encodeURIComponent(id)}`, { replace: false });
  };

  const close = () => {
    setCurrentId(null);
    navigate('/gallery', { replace: true });
  };

  const onPrev = () => {
    if (!currentId) return;
    const idx = filtered.findIndex((p) => p.id === currentId);
    if (idx > 0) setCurrentId(filtered[idx - 1].id);
    else if (filtered.length > 0) setCurrentId(filtered[filtered.length - 1].id);
  };

  const onNext = () => {
    if (!currentId) return;
    const idx = filtered.findIndex((p) => p.id === currentId);
    if (idx >= 0 && idx < filtered.length - 1) setCurrentId(filtered[idx + 1].id);
    else if (filtered.length > 0) setCurrentId(filtered[0].id);
  };

  const copyLink = async (id) => {
    const link = getShareUrl(id);
    try {
      await navigator.clipboard.writeText(`${link}`);
      setLiveMsg('Link copied to clipboard.');
    } catch {
      setLiveMsg('Unable to copy link.');
    }
  };

  useEffect(() => {
    if (liveMsg && liveRef.current) {
      liveRef.current.textContent = liveMsg;
      const t = setTimeout(() => { if (liveRef.current) liveRef.current.textContent = ''; }, 1500);
      return () => clearTimeout(t);
    }
  }, [liveMsg]);

  return (
    <section role="region" aria-label="Photo gallery">
      <Container className="tg-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 className="tg-section__title" style={{ marginBottom: 6 }}>Gallery</h1>
            <p className="tg-section__subtitle" style={{ marginTop: 0 }}>
              Browse and share travel photos from destinations around the world.
            </p>
          </div>
          <div>
            <Link to="/gallery/upload" className="tg-btn" aria-label="Upload a new photo">Upload Photo</Link>
          </div>
        </div>

        <div className="gl-toolbar" role="toolbar" aria-label="Gallery search and filters">
          <label>
            <span className="gl-sr">Search photos</span>
            <input
              className="gl-input"
              type="search"
              placeholder="Search caption, location, uploader"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search photos"
            />
          </label>
          <label>
            <span className="gl-sr">Filter by location</span>
            <select
              className="gl-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Filter by destination"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc === 'all' ? 'All locations' : loc}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="gl-grid" role="list" aria-label="Photos">
          {filtered.map((p) => (
            <div key={p.id} role="listitem">
              <PhotoCard photo={p} onOpen={open} onCopyLink={copyLink} />
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ opacity: 0.8 }}>No photos match your search/filter.</p>
          )}
        </div>

        <div className="gl-sr" aria-live="polite" aria-atomic="true" ref={liveRef} />
      </Container>

      {currentId && (
        <Lightbox
          photos={filtered}
          currentId={currentId}
          onClose={close}
          onPrev={onPrev}
          onNext={onNext}
          onCopyLink={copyLink}
        />
      )}
    </section>
  );
}
