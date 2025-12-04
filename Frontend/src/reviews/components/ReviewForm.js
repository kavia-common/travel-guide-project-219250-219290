import React, { useEffect, useRef, useState } from 'react';
import RatingStars from './RatingStars';
import './reviews.css';

/**
 * PUBLIC_INTERFACE
 * Form for adding or editing a review.
 * Props:
 * - initial?: { title, text, rating }
 * - onSubmit: (data) => Promise<void> | void
 * - onCancel?: () => void
 * - entityType: string
 * - entityId: string|number
 */
export default function ReviewForm({ initial = null, onSubmit, onCancel, entityType, entityId }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [text, setText] = useState(initial?.text || '');
  const [rating, setRating] = useState(initial?.rating || 0);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const liveRef = useRef(null);
  const submitBtnRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!rating || rating < 1 || rating > 5) e.rating = 'Please select a rating between 1 and 5.';
    if (!title.trim()) e.title = 'Please enter a title.';
    if (!text.trim()) e.text = 'Please write a short review.';
    return e;
    };

  const announce = (msg) => {
    if (liveRef.current) {
      liveRef.current.textContent = msg;
      setTimeout(() => {
        if (liveRef.current) liveRef.current.textContent = '';
      }, 1500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length > 0) {
      announce('Please correct the errors in the form.');
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        entityType,
        entityId,
        rating: Number(rating),
        title: title.trim(),
        text: text.trim(),
        photos: [],
      });
      setTitle('');
      setText('');
      setRating(0);
      announce('Review submitted successfully.');
      // focus the submit to keep focus in place
      submitBtnRef.current?.focus();
    } catch (err) {
      announce(err?.message || 'Submission failed.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    // reset when initial changes
    if (initial) {
      setTitle(initial.title || '');
      setText(initial.text || '');
      setRating(initial.rating || 0);
    }
  }, [initial]);

  return (
    <form className="rv-form" onSubmit={handleSubmit} noValidate aria-label="Write a review">
      <div className="rv-sr" aria-live="polite" aria-atomic="true" ref={liveRef} />
      <div className="rv-field">
        <label htmlFor="rv-title">Title</label>
        <input
          id="rv-title"
          className={`rv-input ${errors.title ? 'rv-error' : ''}`}
          type="text"
          placeholder="E.g., Wonderful experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'rv-title-err' : undefined}
        />
        {errors.title && <div id="rv-title-err" className="rv-error-text">{errors.title}</div>}
      </div>

      <div className="rv-field">
        <span className="rv-label">Rating</span>
        <RatingStars
          value={rating}
          onChange={setRating}
          ariaLabel="Set your rating"
        />
        {errors.rating && <div className="rv-error-text">{errors.rating}</div>}
      </div>

      <div className="rv-field">
        <label htmlFor="rv-text">Your review</label>
        <textarea
          id="rv-text"
          className={`rv-textarea ${errors.text ? 'rv-error' : ''}`}
          rows={4}
          placeholder="Share details about your visit..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-invalid={!!errors.text}
          aria-describedby={errors.text ? 'rv-text-err' : undefined}
        />
        {errors.text && <div id="rv-text-err" className="rv-error-text">{errors.text}</div>}
      </div>

      <div className="rv-field">
        <label>Photos (optional)</label>
        <div className="rv-photos-placeholder" role="group" aria-label="Photos upload placeholder">
          <span aria-hidden="true">🖼️</span>
          <span>Photo uploads coming soon</span>
        </div>
      </div>

      <div className="rv-actions">
        <button ref={submitBtnRef} className="rv-btn rv-btn--primary" type="submit" disabled={busy} aria-label="Submit review">
          {busy ? 'Submitting…' : (initial ? 'Save changes' : 'Submit review')}
        </button>
        {onCancel && (
          <button type="button" className="rv-btn" onClick={onCancel} aria-label="Cancel">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
