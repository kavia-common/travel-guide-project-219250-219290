Travel Tips & Safety (frontend-only demo)

- SafetyService: In-memory data for regions (US, FR, IN, JP) with emergency contacts and tips.
- SafetyContext: Provides search/filter and region tips, emergency contacts, and country presets.
- Pages:
  - /safety (SafetyHub): Search, browse categories, and show emergency contacts with copy/tel links.
  - /safety/:regionCode (SafetyDetails): Region-specific tips and contacts.
- Components: SafetySearchBar, TipsList, TipCard, SafetyBadge, CategoryChips, EmergencyContactsCard, Notice.
- Accessibility: aria-labels, aria-live for copy/search updates, focus management on toggles.
- Responsiveness: sticky emergency card on wide screens; collapses on mobile.
- Integration: Leave TODOs in SafetyService for backend/API integration via REACT_APP_BACKEND_URL or REACT_APP_API_BASE.
