# Accommodations (Stays) Feature

This directory contains the Accommodations feature for browsing and booking stays (hotels, hostels, guesthouses).

Key parts:
- AccommodationsContext: In-memory seed data, filter/search/sort logic, and temporary reservation storage. Wraps the app in App.js.
- AccommodationsService: Service stub with seed data; includes TODOs for future backend integration using REACT_APP_BACKEND_URL.
- Components: Search bar, type/amenities chips, price and rating filters, card/list, and BookingWidget with accessible inputs and aria-live regions.
- Pages:
  - /stays: AccommodationsHub with search, filters, and results grid.
  - /stays/:id: AccommodationDetails page with gallery, amenities, policies, reviews integration, and booking widget.
  - /stays/booking/:reservationId: Lightweight confirmation screen using client-side reservation data.

Accessibility:
- Proper labels, roles, keyboard focus management, and aria-live updates for results and booking confirmations.

Note:
- No backend calls are made now. Seed data includes cities like Paris, Tokyo, New York, and Delhi.
- Integrate future APIs by implementing fetch methods in AccommodationsService and wiring them into the context.
