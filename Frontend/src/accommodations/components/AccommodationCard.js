import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/SharedUI.css';
import './accommodations.css';

// PUBLIC_INTERFACE
export default function AccommodationCard({ item }) {
  const photo = item.photos?.[0];
  return (
    <article className="acc-card" aria-label={`${item.name}, ${item.type} in ${item.city}`}>
      <div className="acc-card-photo" style={{ backgroundImage: `url(${photo})` }} aria-hidden="true" />
      <div className="acc-card-body">
        <h3 className="acc-card-title">{item.name}</h3>
        <div className="acc-card-meta">
          <span className="badge">{item.type}</span>
          <span>{item.city}{item.region ? `, ${item.region}` : ''}</span>
          <span className="rating">★ {item.rating?.toFixed(1)}</span>
        </div>
        <div className="acc-card-price">
          <span className="price">${item.pricePerNight}</span>
          <span className="per">per night</span>
        </div>
        <div className="acc-card-actions">
          <Link className="btn-secondary" to={`/stays/${item.id}`} aria-label={`View ${item.name}`}>View</Link>
        </div>
      </div>
    </article>
  );
}
