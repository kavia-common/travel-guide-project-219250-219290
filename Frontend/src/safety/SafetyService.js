//
// PUBLIC_INTERFACE
// SafetyService provides travel safety tips and emergency contacts.
// Currently seeded with in-memory data. Future integration will use REACT_APP_BACKEND_URL or REACT_APP_API_BASE.
//
export class SafetyService {
  constructor(baseUrl = (process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE || '')) {
    this.baseUrl = baseUrl;
    // Seeded data for a few regions. regionCode generally ISO country code.
    this.data = {
      US: {
        regionCode: 'US',
        name: 'United States',
        emergency: {
          police: '911',
          ambulance: '911',
          fire: '911',
          note: 'Dial 911 for all emergencies. 112 can route to 911 on some carriers.'
        },
        embassy: { phone: '', address: '', website: '' }, // Placeholder for future fetch
        tips: [
          {
            id: 'us1',
            title: 'Stay aware in crowded tourist spots',
            details: 'Keep valuables secure and consider anti-theft bags when visiting busy attractions.',
            category: 'General',
            severity: 'low',
          },
          {
            id: 'us2',
            title: 'Weather alerts and hurricanes (coastal areas)',
            details: 'Check NOAA or local advisories during hurricane season (June-Nov).',
            category: 'Weather/Disasters',
            severity: 'high',
          },
          {
            id: 'us3',
            title: 'Rideshare safety',
            details: 'Verify the vehicle plate and driver name before entering. Share your trip status.',
            category: 'Transport',
            severity: 'medium',
          },
          {
            id: 'us4',
            title: 'Common scams',
            details: 'Be cautious of unsolicited street offers or "free gifts" requesting tips later.',
            category: 'Scams',
            severity: 'medium',
          },
        ],
      },
      FR: {
        regionCode: 'FR',
        name: 'France',
        emergency: {
          police: '17',
          ambulance: '15',
          fire: '18',
          note: '112 is the European emergency number usable across the EU.',
        },
        embassy: { phone: '', address: '', website: '' },
        tips: [
          {
            id: 'fr1',
            title: 'Pickpocketing in busy areas',
            details: 'Around major landmarks and public transport hubs, keep items secured.',
            category: 'General',
            severity: 'medium',
          },
          {
            id: 'fr2',
            title: 'Healthcare access',
            details: 'Carry basic medicines. For emergencies, call 15 or use 112 for multipurpose.',
            category: 'Health',
            severity: 'low',
          },
          {
            id: 'fr3',
            title: 'Taxi/Transport',
            details: 'Use licensed taxis or known rideshare apps. Avoid unmarked vehicles.',
            category: 'Transport',
            severity: 'low',
          },
          {
            id: 'fr4',
            title: 'Weather alerts',
            details: 'Check Météo-France for forecasts; heat waves in summer require hydration.',
            category: 'Weather/Disasters',
            severity: 'medium',
          },
        ],
      },
      IN: {
        regionCode: 'IN',
        name: 'India',
        emergency: {
          police: '112',
          ambulance: '102',
          fire: '101',
          note: '112 is a pan-India emergency number connecting to local services.',
        },
        embassy: { phone: '', address: '', website: '' },
        tips: [
          {
            id: 'in1',
            title: 'Health & water safety',
            details: 'Drink bottled/filtered water. Carry hand sanitizer and basic meds.',
            category: 'Health',
            severity: 'medium',
          },
          {
            id: 'in2',
            title: 'Traffic caution',
            details: 'Road conditions and traffic can vary. Use reputable drivers and wear seat belts.',
            category: 'Transport',
            severity: 'medium',
          },
          {
            id: 'in3',
            title: 'Monsoon season',
            details: 'Flooding can occur during monsoon; plan routes and carry rain protection.',
            category: 'Weather/Disasters',
            severity: 'high',
          },
          {
            id: 'in4',
            title: 'Common scams',
            details: 'Beware of unsolicited guides and fake ticket counters.',
            category: 'Scams',
            severity: 'medium',
          },
        ],
      },
      JP: {
        regionCode: 'JP',
        name: 'Japan',
        emergency: {
          police: '110',
          ambulance: '119',
          fire: '119',
          note: '112 may connect via certain carriers, but 110/119 are primary.',
        },
        embassy: { phone: '', address: '', website: '' },
        tips: [
          {
            id: 'jp1',
            title: 'Earthquake preparedness',
            details: 'Follow local instructions. Identify nearest evacuation spots.',
            category: 'Weather/Disasters',
            severity: 'high',
          },
          {
            id: 'jp2',
            title: 'Public transport etiquette',
            details: 'Queue in lines; keep noise low and allow exiting passengers first.',
            category: 'Transport',
            severity: 'low',
          },
          {
            id: 'jp3',
            title: 'General safety',
            details: 'Japan is generally safe; still practice standard precautions.',
            category: 'General',
            severity: 'low',
          },
          {
            id: 'jp4',
            title: 'Health tips',
            details: 'Carry a small card with any allergies translated to Japanese.',
            category: 'Health',
            severity: 'low',
          },
        ],
      },
    };
  }

  // PUBLIC_INTERFACE
  async listRegions() {
    /** Returns a list of available regions with basic labels. */
    return Object.values(this.data).map(r => ({ regionCode: r.regionCode, name: r.name }));
  }

  // PUBLIC_INTERFACE
  async getRegion(regionCode) {
    /** Returns region data including tips and emergency contacts. */
    return this.data[regionCode] || null;
  }

  // PUBLIC_INTERFACE
  async searchTips(query = '', { category = 'all', severity = 'all' } = {}) {
    /**
     * Search across all regions' tips by query/category/severity.
     * Returns an array of {regionCode, regionName, ...tip}
     */
    const q = String(query).trim().toLowerCase();
    const results = [];
    for (const region of Object.values(this.data)) {
      for (const tip of region.tips) {
        const catOk = category === 'all' || (tip.category || '').toLowerCase() === category.toLowerCase();
        const sevOk = severity === 'all' || (tip.severity || '').toLowerCase() === severity.toLowerCase();
        const qOk = !q ||
          (tip.title && tip.title.toLowerCase().includes(q)) ||
          (tip.details && tip.details.toLowerCase().includes(q)) ||
          (region.name && region.name.toLowerCase().includes(q)) ||
          (region.regionCode && region.regionCode.toLowerCase().includes(q));
        if (catOk && sevOk && qOk) {
          results.push({ ...tip, regionCode: region.regionCode, regionName: region.name });
        }
      }
    }
    return results;
  }

  // PUBLIC_INTERFACE
  async listTipsByRegion(regionCode, { category = 'all', severity = 'all' } = {}) {
    /** Returns tips for a specific region with optional filters. */
    const region = this.data[regionCode];
    if (!region) return [];
    return region.tips.filter((t) => {
      const catOk = category === 'all' || (t.category || '').toLowerCase() === category.toLowerCase();
      const sevOk = severity === 'all' || (t.severity || '').toLowerCase() === severity.toLowerCase();
      return catOk && sevOk;
    });
  }

  // PUBLIC_INTERFACE
  async getEmergencyContacts(regionCode) {
    /** Returns police/ambulance/fire and placeholder embassy info for the region. */
    const region = this.data[regionCode];
    return region ? { ...region.emergency, embassy: region.embassy, regionCode, regionName: region.name } : null;
  }

  // PUBLIC_INTERFACE
  async suggestCountryPresets() {
    /** Returns a list of country presets suitable for UI select chips. */
    const base = await this.listRegions();
    return base.sort((a, b) => a.name.localeCompare(b.name));
  }

  // PUBLIC_INTERFACE
  async getCategoryList() {
    /** Returns canonical categories used by the UI to render chips/filters. */
    return ['General', 'Health', 'Transport', 'Scams', 'Weather/Disasters'];
  }

  // ----- Future backend integration notes -----
  // TODO: Replace in-memory with real API calls:
  // - const base = this.baseUrl;
  // - await fetch(`${base}/safety/regions`)
  // - await fetch(`${base}/safety/regions/${regionCode}`)
  // - await fetch(`${base}/safety/tips?query=...&category=...&severity=...`)
}

export default SafetyService;
