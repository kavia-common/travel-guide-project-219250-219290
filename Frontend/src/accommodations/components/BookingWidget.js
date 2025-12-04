import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccommodations } from '../AccommodationsContext';
import './accommodations.css';

// PUBLIC_INTERFACE
export default function BookingWidget({ accommodation }) {
  const { createReservation } = useAccommodations();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('standard');
  const [error, setError] = useState('');
  const liveRef = useRef(null);
  const navigate = useNavigate();

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const inD = new Date(checkIn);
    const outD = new Date(checkOut);
    const diff = (outD - inD) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const roomMultiplier = roomType === 'deluxe' ? 1.3 : roomType === 'suite' ? 1.6 : 1.0;

  const priceEstimate = useMemo(() => {
    return Math.round(accommodation.pricePerNight * roomMultiplier * Math.max(1, nights));
  }, [accommodation.pricePerNight, nights, roomMultiplier]);

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Estimated price ${priceEstimate} dollars`;
    }
  }, [priceEstimate]);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.');
      return;
    }
    if (nights <= 0) {
      setError('Check-out date must be after check-in.');
      return;
    }
    const reservation = createReservation({
      accommodationId: accommodation.id,
      checkIn,
      checkOut,
      guests,
      roomType,
      priceEstimate,
    });
    // announce confirmation and navigate
    if (liveRef.current) {
      liveRef.current.textContent = `Booking created. Reference ${reservation.id}`;
    }
    // lightweight confirmation route
    navigate(`/stays/booking/${reservation.id}`);
  };

  return (
    <section className="booking-widget" aria-label="Booking widget">
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="check-in">Check-in</label>
          <input id="check-in" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="check-out">Check-out</label>
          <input id="check-out" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="guests">Guests</label>
          <div className="stepper">
            <button type="button" aria-label="Decrease guests" onClick={() => setGuests(g => Math.max(1, g - 1))}>-</button>
            <input id="guests" type="number" value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))} min={1} />
            <button type="button" aria-label="Increase guests" onClick={() => setGuests(g => g + 1)}>+</button>
          </div>
        </div>
        <div className="field">
          <label htmlFor="room-type">Room type</label>
          <select id="room-type" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe (+30%)</option>
            <option value="suite">Suite (+60%)</option>
          </select>
        </div>

        <div className="estimate">
          <strong aria-live="polite" aria-atomic="true" ref={liveRef}>Estimated price {priceEstimate} dollars</strong>
          <div className="muted">{nights} {nights === 1 ? 'night' : 'nights'}</div>
        </div>

        {error ? <div role="alert" className="error">{error}</div> : null}

        <div className="actions">
          <button type="submit" className="btn-primary">Book now</button>
        </div>
      </form>
    </section>
  );
}
