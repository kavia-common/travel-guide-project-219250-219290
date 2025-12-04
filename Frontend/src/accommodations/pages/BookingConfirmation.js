import React, { useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccommodations } from '../AccommodationsContext';
import '../../components/SharedUI.css';

// PUBLIC_INTERFACE
export default function BookingConfirmation() {
  const { reservationId } = useParams();
  const { getReservation, accommodations } = useAccommodations();
  const reservation = getReservation(reservationId);
  const h1Ref = useRef(null);

  const stay = useMemo(() => {
    if (!reservation) return null;
    return accommodations.find(a => a.id === reservation.accommodationId) || null;
  }, [accommodations, reservation]);

  useEffect(() => {
    h1Ref.current?.focus();
  }, []);

  if (!reservation) {
    return (
      <div className="container">
        <h1 tabIndex={-1} ref={h1Ref}>Reservation not found</h1>
        <p>We could not find a reservation with ID {reservationId}.</p>
        <Link to="/stays" className="btn-secondary">Back to stays</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 tabIndex={-1} ref={h1Ref}>Booking confirmed</h1>
      <p role="status" aria-live="polite">Your reference number is <strong>{reservation.id}</strong></p>

      <div className="panel" style={{ marginTop: '1rem' }}>
        <h2>Summary</h2>
        <ul>
          <li><strong>Property:</strong> {stay?.name} ({stay?.city})</li>
          <li><strong>Check-in:</strong> {reservation.checkIn}</li>
          <li><strong>Check-out:</strong> {reservation.checkOut}</li>
          <li><strong>Guests:</strong> {reservation.guests}</li>
          <li><strong>Room type:</strong> {reservation.roomType}</li>
          <li><strong>Estimated price:</strong> ${reservation.priceEstimate}</li>
        </ul>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/stays" className="btn-primary">Find another stay</Link>
      </div>
    </div>
  );
}
