import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import TransportService from './TransportService';

/**
 * Transport data model (seeded in-memory)
 * region: {
 *   code: 'US-NYC',
 *   name: 'New York City',
 *   country: 'US',
 *   passes: [{ name, description, priceRange, link }],
 *   airportTransfers: [{ mode, info, link }],
 *   faq: [{ q, a }],
 *   tips: [string],
 *   options: [
 *     {
 *       id, name, operator, type: 'bus'|'train'|'taxi',
 *       coverage: string,
 *       routes: string[],
 *       schedule: { first: string, last: string, frequency: string },
 *       fareRange: string,
 *       links: { booking?: string, official?: string },
 *       tips: string[]
 *     }
 *   ]
 * }
 */

const seedData = [
  {
    code: 'US-NYC',
    name: 'New York City',
    country: 'US',
    passes: [
      { name: 'Unlimited MetroCard (OMNY)', description: '7-day and 30-day unlimited rides on subway and local buses.', priceRange: '$34–$132', link: 'https://new.mta.info/fares' },
    ],
    airportTransfers: [
      { mode: 'Train', info: 'AirTrain JFK connects to subway and LIRR; fixed fare from JFK to Jamaica/Howard Beach.', link: 'https://new.mta.info/airtrain' },
      { mode: 'Bus', info: 'Express buses from airports to Manhattan hubs.', link: 'https://new.mta.info/bus' },
      { mode: 'Taxi', info: 'Flat fare from JFK to Manhattan; metered elsewhere; use licensed yellow/green cabs.', link: 'https://www.nyc.gov/site/tlc/passengers/taxi-fare.page' },
    ],
    faq: [
      { q: 'Is the subway 24/7?', a: 'Service runs 24/7 though frequency drops at night; planned work may affect service.' },
      { q: 'Can I pay with contactless?', a: 'Yes, OMNY supports tap-to-pay on subways and buses.' },
    ],
    tips: [
      'Avoid peak hours (7–10am, 4–7pm) for less crowded trains.',
      'Use official MTA apps or site for service updates.',
    ],
    options: [
      {
        id: 'us-nyc-subway',
        name: 'Subway',
        operator: 'MTA',
        type: 'train',
        coverage: '5 boroughs',
        routes: ['Lines A–Z, 1–7', 'Staten Island Railway (separate fare)'],
        schedule: { first: '00:00', last: '24:00', frequency: '2–10 min peak, 10–20 min off-peak' },
        fareRange: '$2.90 per ride; unlimited passes available',
        links: { official: 'https://new.mta.info/' },
        tips: ['Check weekend service changes.', 'Tap with OMNY or use MetroCard.'],
      },
      {
        id: 'us-nyc-bus',
        name: 'Local/Express Buses',
        operator: 'MTA',
        type: 'bus',
        coverage: 'Citywide',
        routes: ['Local routes', 'Select Bus Service (SBS)', 'Express buses'],
        schedule: { first: '05:00', last: '01:00', frequency: '5–20 min depending on route/time' },
        fareRange: '$2.90 local; express higher',
        links: { official: 'https://new.mta.info/bus' },
        tips: ['Use all-door boarding on SBS.', 'Have fare ready before boarding.'],
      },
      {
        id: 'us-nyc-taxi',
        name: 'Taxi & Ride-hailing',
        operator: 'TLC-licensed',
        type: 'taxi',
        coverage: 'Citywide',
        routes: ['Street-hail yellow cabs', 'App-based rides (Uber/Lyft)'],
        schedule: { first: '-', last: '-', frequency: 'On-demand' },
        fareRange: 'Metered; surcharges may apply',
        links: { official: 'https://www.nyc.gov/site/tlc/index.page', booking: 'https://www.uber.com/' },
        tips: ['Use official cabs; avoid unlicensed rides.', 'Expect higher fares during peak times.'],
      },
    ],
  },
  {
    code: 'IN-DEL',
    name: 'Delhi',
    country: 'IN',
    passes: [
      { name: 'Delhi Metro Smart Card', description: 'Stored value card with discounts and convenience.', priceRange: '₹150 minimum top-up', link: 'https://www.delhimetrorail.com/' },
    ],
    airportTransfers: [
      { mode: 'Airport Express Metro', info: 'Connects IGI Airport to New Delhi station quickly.', link: 'https://www.delhimetrorail.com/a-line-airport-express' },
    ],
    faq: [
      { q: 'Are women-only coaches available?', a: 'Yes, Delhi Metro has reserved coaches; abide by signage.' },
    ],
    tips: ['Carry small change for buses.', 'Use official apps for schedules.'],
    options: [
      {
        id: 'in-del-metro',
        name: 'Delhi Metro',
        operator: 'DMRC',
        type: 'train',
        coverage: 'NCR wide coverage',
        routes: ['Multiple lines incl. Blue, Yellow, Violet, Magenta, Airport Express'],
        schedule: { first: '05:00', last: '23:30', frequency: '3–8 min' },
        fareRange: '₹10–₹60 depending on distance',
        links: { official: 'https://www.delhimetrorail.com/' },
        tips: ['Respect priority seating.', 'Avoid peak hours for comfort.'],
      },
      {
        id: 'in-del-bus',
        name: 'DTC & Cluster Buses',
        operator: 'DTC',
        type: 'bus',
        coverage: 'Delhi NCR',
        routes: ['Extensive local routes'],
        schedule: { first: '05:00', last: '23:00', frequency: '5–20 min' },
        fareRange: '₹5–₹25 local',
        links: { official: 'http://dtc.delhi.gov.in/' },
        tips: ['Keep valuables secure.', 'Confirm route number before boarding.'],
      },
      {
        id: 'in-del-taxi',
        name: 'Taxi & App Cabs',
        operator: 'Licensed',
        type: 'taxi',
        coverage: 'Citywide',
        routes: ['App rides (Ola, Uber)', 'Prepaid airport taxis'],
        schedule: { first: '-', last: '-', frequency: 'On-demand' },
        fareRange: 'Metered or dynamic app pricing',
        links: { booking: 'https://www.ola.cab/' },
        tips: ['Check driver/vehicle details before starting.', 'Prefer prepaid at airports.'],
      },
    ],
  },
  {
    code: 'JP-TYO',
    name: 'Tokyo',
    country: 'JP',
    passes: [
      { name: 'Tokyo Subway Ticket', description: 'Unlimited rides on Toei and Tokyo Metro for 24/48/72 hours.', priceRange: '¥800–¥1500', link: 'https://www.tokyometro.jp/en/ticket/' },
    ],
    airportTransfers: [
      { mode: 'Airport Rail', info: 'Keisei Skyliner, Narita Express, and rapid trains connect airports to the city.', link: 'https://www.jreast.co.jp/e/nex/' },
    ],
    faq: [
      { q: 'Are trains punctual?', a: 'Yes, trains are very punctual with frequent services.' },
    ],
    tips: ['Queue politely and keep noise low.', 'Last trains stop around midnight.'],
    options: [
      {
        id: 'jp-tyo-metro',
        name: 'Tokyo Metro/Toei',
        operator: 'Tokyo Metro & Toei',
        type: 'train',
        coverage: '23 wards and beyond',
        routes: ['Ginza, Marunouchi, Hibiya, etc.'],
        schedule: { first: '05:00', last: '00:30', frequency: '2–5 min' },
        fareRange: '¥170–¥320; passes available',
        links: { official: 'https://www.tokyometro.jp/' },
        tips: ['Mind the last train times.', 'Consider IC cards (Suica/PASMO).'],
      },
      {
        id: 'jp-tyo-bus',
        name: 'Toei Bus',
        operator: 'Toei',
        type: 'bus',
        coverage: 'Citywide',
        routes: ['Major corridors and local routes'],
        schedule: { first: '05:00', last: '22:30', frequency: '5–20 min' },
        fareRange: 'Flat fares; IC accepted',
        links: { official: 'https://www.kotsu.metro.tokyo.jp/eng/' },
        tips: ['Pay when boarding or exiting depending on route.', 'Carry small change if not using IC.'],
      },
      {
        id: 'jp-tyo-taxi',
        name: 'Taxi',
        operator: 'Licensed operators',
        type: 'taxi',
        coverage: 'Citywide',
        routes: ['Street hail and app rides'],
        schedule: { first: '-', last: '-', frequency: 'On-demand' },
        fareRange: 'Metered; night surcharge applies',
        links: { booking: 'https://taxi.tokyo/' },
        tips: ['Rear doors open automatically; avoid closing manually.', 'Cards and IC widely accepted.'],
      },
    ],
  },
  {
    code: 'FR-PAR',
    name: 'Paris',
    country: 'FR',
    passes: [
      { name: 'Navigo Pass', description: 'Weekly/monthly passes covering zones in Île-de-France.', priceRange: '€30–€85', link: 'https://www.iledefrance-mobilites.fr/en' },
    ],
    airportTransfers: [
      { mode: 'RER/Bus', info: 'RER B connects CDG to Paris; OrlyBus/OrlyVal for Orly.', link: 'https://www.transilien.com/' },
    ],
    faq: [
      { q: 'Are there strike days?', a: 'Occasional strikes affect service; check announcements.' },
    ],
    tips: ['Validate tickets/pass when required.', 'Keep an eye on belongings.'],
    options: [
      {
        id: 'fr-par-metro',
        name: 'Metro & RER',
        operator: 'RATP/SNCF',
        type: 'train',
        coverage: 'Île-de-France',
        routes: ['Metro 1–14, RER A–E, Transilien'],
        schedule: { first: '05:30', last: '01:15', frequency: '2–10 min' },
        fareRange: '€2.15 single; zones vary',
        links: { official: 'https://www.ratp.fr/en' },
        tips: ['Door buttons may need pressing to open.', 'Mind pickpockets at tourist sites.'],
      },
      {
        id: 'fr-par-bus',
        name: 'Bus',
        operator: 'RATP',
        type: 'bus',
        coverage: 'Citywide and suburbs',
        routes: ['Local and Noctilien night buses'],
        schedule: { first: '05:30', last: '00:30', frequency: '6–20 min' },
        fareRange: '€2.15 single; passes accepted',
        links: { official: 'https://www.ratp.fr/en' },
        tips: ['Validate on board.', 'Night buses cover late hours.'],
      },
      {
        id: 'fr-par-taxi',
        name: 'Taxi/Ride-hailing',
        operator: 'Licensed',
        type: 'taxi',
        coverage: 'Citywide',
        routes: ['Street hail at stands; app rides'],
        schedule: { first: '-', last: '-', frequency: 'On-demand' },
        fareRange: 'Metered; airport flat fares available',
        links: { official: 'https://www.paris.fr/pages/taxis-2249', booking: 'https://www.uber.com/' },
        tips: ['Use official taxi stands.', 'Expect traffic delays at peak times.'],
      },
    ],
  },
];

const TransportContext = createContext(null);

export function useTransport() {
  const ctx = useContext(TransportContext);
  if (!ctx) throw new Error('useTransport must be used within TransportProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function TransportProvider({ children }) {
  /**
   * PUBLIC_INTERFACE
   * Provides transport data, filters, and helpers across the app.
   */
  const [regions, setRegions] = useState([]);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'bus' | 'train' | 'taxi'
  const [selectedRegion, setSelectedRegion] = useState(null); // region code string or null

  // Simulate future backend fetch with a service, but use seed now
  useEffect(() => {
    // TODO: Replace with TransportService.listRegions() when backend is ready
    setRegions(seedData);
  }, []);

  const allOptions = useMemo(() => {
    return regions.flatMap(r =>
      r.options.map(o => ({
        ...o,
        regionCode: r.code,
        regionName: r.name,
        country: r.country,
      })),
    );
  }, [regions]);

  // PUBLIC_INTERFACE
  const listRegions = useCallback(() => {
    /** Returns available regions with minimal metadata. */
    return regions.map(r => ({ code: r.code, name: r.name, country: r.country }));
  }, [regions]);

  // PUBLIC_INTERFACE
  const getRegionDetails = useCallback((code) => {
    /** Returns rich region details including passes, airportTransfers, faq, tips, and options. */
    return regions.find(r => r.code.toLowerCase() === String(code || '').toLowerCase()) || null;
  }, [regions]);

  // PUBLIC_INTERFACE
  const listOptions = useCallback((filters = {}) => {
    /** List transport options filtered by region and type and search query. */
    const { regionCode, type, q } = filters;
    let items = allOptions;
    if (regionCode && regionCode !== 'all') {
      items = items.filter(it => String(it.regionCode).toLowerCase() === String(regionCode).toLowerCase());
    }
    if (type && type !== 'all') {
      items = items.filter(it => it.type === type);
    }
    const queryText = (q ?? query).trim().toLowerCase();
    if (queryText) {
      items = items.filter(it => {
        return (
          it.name.toLowerCase().includes(queryText) ||
          it.operator.toLowerCase().includes(queryText) ||
          it.routes.join(' ').toLowerCase().includes(queryText) ||
          it.regionName.toLowerCase().includes(queryText)
        );
      });
    }
    return items;
  }, [allOptions, query]);

  const value = useMemo(() => {
    return {
      query,
      setQuery,
      typeFilter,
      setTypeFilter,
      selectedRegion,
      setSelectedRegion,
      listRegions,
      listOptions,
      getRegionDetails,
      service: TransportService, // expose stub for future usage
    };
  }, [query, typeFilter, selectedRegion, listRegions, listOptions, getRegionDetails]);

  return <TransportContext.Provider value={value}>{children}</TransportContext.Provider>;
}

export default TransportContext;
