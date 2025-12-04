export default class AccommodationsService {
  /**
   * Construct service with optional backend URL for future integration.
   * @param {string|undefined} backendUrl
   */
  constructor(backendUrl) {
    this.backendUrl = backendUrl || '';
  }

  // TODO: Integrate with backend when endpoints are available
  // Example planned APIs:
  // - GET `${this.backendUrl}/api/accommodations?city=&type=&priceMin=&priceMax=&ratingMin=&amenities=`
  // - GET `${this.backendUrl}/api/accommodations/{id}`
  // - POST `${this.backendUrl}/api/reservations` body: { accommodationId, checkIn, checkOut, guests, roomType, contact }
  // For now, the UI uses in-memory seed data and local reservations only.

  /**
   * Returns seed data for initial prototype.
   */
  getSeedData() {
    const seed = [
      {
        id: 'paris-hotel-eiffel',
        name: 'Eiffel View Hotel',
        city: 'Paris',
        region: 'Île-de-France',
        country: 'France',
        type: 'hotel',
        pricePerNight: 180,
        rating: 4.5,
        amenities: ['wifi', 'breakfast', 'parking', 'gym'],
        photos: [
          'https://images.unsplash.com/photo-1501117716987-c8e2aee6c1a5?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop',
        ],
        policies: 'Check-in after 3 PM. Free cancellation up to 48 hours before arrival.',
        locationText: 'Near Champ de Mars with direct metro access.',
        featured: true,
      },
      {
        id: 'tokyo-hostel-shibuya',
        name: 'Shibuya Social Hostel',
        city: 'Tokyo',
        region: 'Kantō',
        country: 'Japan',
        type: 'hostel',
        pricePerNight: 45,
        rating: 4.2,
        amenities: ['wifi', 'laundry', 'shared-kitchen'],
        photos: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
        ],
        policies: 'Check-in after 2 PM. Shared dorms. Quiet hours 10 PM - 7 AM.',
        locationText: '5-minute walk to Shibuya Crossing and JR lines.',
      },
      {
        id: 'newyork-guesthouse-central',
        name: 'Central Park Guesthouse',
        city: 'New York',
        region: 'NY',
        country: 'USA',
        type: 'guesthouse',
        pricePerNight: 120,
        rating: 4.0,
        amenities: ['wifi', 'breakfast', 'air-conditioning'],
        photos: [
          'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1560185008-b033106af5e4?q=80&w=1200&auto=format&fit=crop',
        ],
        policies: 'Check-in after 1 PM. No smoking. Family-friendly.',
        locationText: 'Two blocks from Central Park, close to subway lines B and C.',
      },
      {
        id: 'delhi-hotel-connaught',
        name: 'Connaught Place Boutique Hotel',
        city: 'Delhi',
        region: 'NCT',
        country: 'India',
        type: 'hotel',
        pricePerNight: 95,
        rating: 4.1,
        amenities: ['wifi', 'breakfast', 'airport-shuttle', 'room-service'],
        photos: [
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
        ],
        policies: 'Check-in after 12 PM. 24/7 front desk. Free city map.',
        locationText: 'Located in the heart of Connaught Place; metro and markets nearby.',
      },
      {
        id: 'paris-guesthouse-montmartre',
        name: 'Montmartre Cozy Guesthouse',
        city: 'Paris',
        region: 'Île-de-France',
        country: 'France',
        type: 'guesthouse',
        pricePerNight: 85,
        rating: 4.3,
        amenities: ['wifi', 'breakfast', 'pet-friendly'],
        photos: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
        ],
        policies: 'Self check-in available. Pets allowed with prior notice.',
        locationText: 'Steps away from Sacré-Cœur Basilica and local cafés.',
      },
      {
        id: 'tokyo-hotel-ginza',
        name: 'Ginza Business Hotel',
        city: 'Tokyo',
        region: 'Kantō',
        country: 'Japan',
        type: 'hotel',
        pricePerNight: 150,
        rating: 4.6,
        amenities: ['wifi', 'breakfast', 'spa', 'gym'],
        photos: [
          'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
        ],
        policies: 'Executive floors. On-site spa. Early check-in on request.',
        locationText: 'Prime Ginza location near luxury shops and eateries.',
        featured: true,
      },
    ];
    return seed;
  }
}
