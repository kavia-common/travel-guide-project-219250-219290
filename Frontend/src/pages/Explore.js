import React from 'react';
import '../App.css';
import { Container } from '../components/SharedUI';
import { DestinationCard } from '../components/SharedUI';
import AverageRatingBadge from '../reviews/components/AverageRatingBadge';
import { Link, useNavigate } from 'react-router-dom';
import MapWidget from '../maps/components/MapWidget';
import { useReviews } from '../reviews/ReviewsContext';
import '../components/SharedUI.css';
import '../components/Header.css';

// PUBLIC_INTERFACE
export default function Explore() {
  /**
   * Explore page: displays a responsive grid of sample destinations using static data.
   * Accessible semantics and keyboard-friendly controls included.
   */
  const destinations = [
    {
      id: 1,
      title: 'Paris',
      location: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Kyoto',
      location: 'Japan',
      image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'New York',
      location: 'United States',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'Cape Town',
      location: 'South Africa',
      image: 'https://images.unsplash.com/photo-1501601962690-0877df9cc836?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 5,
      title: 'Santorini',
      location: 'Greece',
      image: 'https://images.unsplash.com/photo-1509123322038-0239e03838d4?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 6,
      title: 'Machu Picchu',
      location: 'Peru',
      image: 'https://images.unsplash.com/photo-1505679425591-46c07f631849?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  const navigate = useNavigate();
  const handleView = (title) => {
    navigate(`/destinations/${encodeURIComponent(title)}`);
  };

  return (
    <section role="region" aria-label="Explore destinations">
      <Container className="tg-section">
        <h1 className="tg-section__title">Explore</h1>
        <p className="tg-section__subtitle">
          Start discovering destinations, attractions, and experiences.
        </p>

        <div className="tg-grid" role="list">
          {destinations.map((d) => (
            <div role="listitem" key={d.id}>
              <DestinationCard
                image={d.image}
                title={d.title}
                location={d.location}
                onClick={() => handleView(d.title)}
                actionLabel="View"
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 6px' }}>
                <AverageRatingBadge entityType="destination" entityId={d.title} size="sm" />
                <Link to={`/destinations/${encodeURIComponent(d.title)}`} className="App-link" aria-label={`Read reviews for ${d.title}`}>
                  Read reviews →
                </Link>
              </div>
              <div style={{ marginTop: 6 }}>
                <MapWidget destName={d.title} height={120} />
              </div>
              <div style={{ marginTop: 6 }}>
                <Link to={`/maps?dest=${encodeURIComponent(d.title)}`} className="App-link" aria-label={`View ${d.title} on map`}>
                  View on Map →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
