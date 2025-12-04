import React, { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAccommodations } from '../AccommodationsContext';
import BookingWidget from '../components/BookingWidget';
import { AverageRatingBadge, ReviewsList } from '../../reviews/components';
import '../../components/SharedUI.css';
import '../components/accommodations.css';

// PUBLIC_INTERFACE
export default function AccommodationDetails() {
  const { id } = useParams();
  const { accommodations } = useAccommodations();
  const accommodation = useMemo(() => accommodations.find(a => a.id === id), [accommodations, id]);
  const h1Ref = useRef(null);

  useEffect(() => {
    h1Ref.current?.focus();
  }, []);

  if (!accommodation) return <div className="container"><p>Stay not found.</p></div>;

  return (
    <div className="container">
      <h1 tabIndex={-1} ref={h1Ref}>{accommodation.name}</h1>
      <div className="details-layout">
        <div className="details-photos">
          <div className="photo-gallery" role="list" aria-label="Photo gallery">
            {(accommodation.photos || []).map((p, idx) => (
              <div key={idx} role="listitem" className="ph" style={{ backgroundImage: `url(${p})` }} aria-label={`Photo ${idx + 1}`} />
            ))}
          </div>

          <section aria-label="Details" style={{ marginTop: '1rem' }}>
            <h2>About this stay</h2>
            <p>{accommodation.locationText}</p>

            <h3>Amenities</h3>
            <ul>
              {(accommodation.amenities || []).map(a => <li key={a}>{a}</li>)}
            </ul>

            <h3>Policies</h3>
            <p>{accommodation.policies}</p>
          </section>

          <section aria-label="Reviews" style={{ marginTop: '1rem' }}>
            <h2>Reviews</h2>
            <AverageRatingBadge rating={accommodation.rating} />
            <ReviewsList entityId={accommodation.id} />
          </section>
        </div>

        <div className="details-info">
          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div className="badge">{accommodation.type}</div>
                <div style={{ marginTop: '0.25rem' }}>
                  <strong>★ {accommodation.rating?.toFixed(1)}</strong> · {accommodation.city}{accommodation.region ? `, ${accommodation.region}` : ''}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${accommodation.pricePerNight}</div>
                <div className="muted">per night</div>
              </div>
            </div>
          </div>

          <BookingWidget accommodation={accommodation} />
        </div>
      </div>
    </div>
  );
}
