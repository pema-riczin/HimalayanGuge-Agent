import React, { useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { fetchMapsExpeditionAI } from '../services/api.ts';
import { MapsGroundingResponse } from '../types/index.ts';
import { 
  MapPin, 
  Navigation, 
  Sparkles, 
  Search, 
  AlertTriangle, 
  Clock, 
  Mountain, 
  Building2, 
  Plane, 
  ShieldAlert, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw,
  Compass,
  ArrowRight,
  Layers,
  PhoneCall,
  Crosshair
} from 'lucide-react';

interface Waypoint {
  id: string;
  title: string;
  nativeName: string;
  category: 'hospital' | 'helipad' | 'clinic' | 'pass';
  position: { lat: number; lng: number };
  elevationM: number;
  corridor: 'mustang' | 'dolakha' | 'pokhara' | 'kathmandu';
  facilityType: string;
  description: string;
  evacProtocol: string;
  emergencyPhone?: string;
}

const EXPEDITION_WAYPOINTS: Waypoint[] = [
  // Upper Mustang Corridor
  {
    id: 'lo-manthang-lz',
    title: 'Lo Manthang Emergency Helipad',
    nativeName: 'གློ་སྨོན་ཐང་ ཐད་འཕུར་ཐང༌།',
    category: 'helipad',
    position: { lat: 29.1824, lng: 83.9572 },
    elevationM: 3840,
    corridor: 'mustang',
    facilityType: 'Unpaved High-Altitude LZ (Clear in morning winds)',
    description: 'Flat plateau gravel zone outside northern town gates. Altitude 3,840m. Evacuation windows typically strictly between 06:00 - 10:30 AM before afternoon high-gale valley winds.',
    evacProtocol: 'Frequencies: Simrik / Fishtail / Dynasty Air VHF. Ground contact via Mustang Medical Volunteer Radio.'
  },
  {
    id: 'lo-manthang-clinic',
    title: 'Lo Manthang Tsonup Health Clinic & Sowa-Rigpa Post',
    nativeName: 'གློ་སྨོན་ཐང་ གསོ་རིག་སྨན་ཁང༌།',
    category: 'clinic',
    position: { lat: 29.1835, lng: 83.9560 },
    elevationM: 3850,
    corridor: 'mustang',
    facilityType: 'Integrative Allopathic & Sowa-Rigpa Community Clinic',
    description: 'Central Upper Mustang healthcare facility offering emergency Gamow bag, portable oxygen concentrators, and traditional Amchi Tibetan herb dispensary.',
    evacProtocol: 'Primary triage before requesting rotor evacuation to Pokhara or Kathmandu.'
  },
  {
    id: 'tsarang-helipad',
    title: 'Tsarang Helipad & Health Post',
    nativeName: 'ཙཱ་རང་ འཕྲོད་བསྟེན་ས་ཚིགས།',
    category: 'helipad',
    position: { lat: 29.0528, lng: 83.9312 },
    elevationM: 3560,
    corridor: 'mustang',
    facilityType: 'Secondary Evacuation LZ & Health Post',
    description: 'Landing zone south of Tsarang fortress & palace. Altitude 3,560m. Staging point for patients descending from Lo Manthang with AMS / HAPE.',
    evacProtocol: 'Accessible via 4WD Kali Gandaki road or helicopter airlift direct to Pokhara (35 min flight time).'
  },
  {
    id: 'jomsom-airport',
    title: 'Jomsom Airport & Helipad (JMO)',
    nativeName: 'जोमसोम विमानस्थल',
    category: 'helipad',
    position: { lat: 28.7831, lng: 83.7225 },
    elevationM: 2743,
    corridor: 'mustang',
    facilityType: 'Asphalt STOL Runway (06/24) & Helipad Zone',
    description: 'Primary aviation gateway to Mustang along the Kali Gandaki corridor. Twin Otter & Dornier flights to Pokhara, weather permitting before 11:00 AM.',
    evacProtocol: 'Direct twin-engine STOL aircraft (18 min flight to Pokhara) or private rescue helicopter.'
  },
  {
    id: 'jomsom-hospital',
    title: 'Jomsom District Hospital',
    nativeName: 'जोमसोम जिल्ला अस्पताल',
    category: 'hospital',
    position: { lat: 28.7842, lng: 83.7288 },
    elevationM: 2750,
    corridor: 'mustang',
    facilityType: 'Government District Hospital',
    description: 'Staffed with medical officers, basic X-ray, lab, inpatient beds, and emergency oxygen manifold. Primary stabilization for Kali Gandaki trekkers.',
    evacProtocol: 'Can stabilize altitude cases at 2,750m before ground or air transfer.',
    emergencyPhone: '+977-69-440114'
  },
  {
    id: 'kagbeni-checkpost',
    title: 'Kagbeni Restricted Area Outpost',
    nativeName: 'कागबेनी चेकपोस्ट',
    category: 'pass',
    position: { lat: 28.8356, lng: 83.7844 },
    elevationM: 2804,
    corridor: 'mustang',
    facilityType: 'Restricted Permit Checkpost & Acclimatization Staging',
    description: 'Junction of Upper Mustang Restricted Area and Muktinath pilgrim highway. Essential checkpoint for acclimatization pacing.',
    evacProtocol: 'Immediate descent route toward Jomsom (12 km south on road).'
  },

  // Pokhara & Kathmandu Evacuation Referrals
  {
    id: 'pokhara-western-hospital',
    title: 'Western Regional Hospital (WRH) Emergency',
    nativeName: 'पश्चिमाञ्चल क्षेत्रीय अस्पताल (पोखरा)',
    category: 'hospital',
    position: { lat: 28.2198, lng: 83.9984 },
    elevationM: 820,
    corridor: 'pokhara',
    facilityType: 'Tertiary Government Referral Center & ICU',
    description: 'Largest trauma and emergency tertiary center in Gandaki Province. 24/7 ICU, CT scan, blood bank, and surgical suites for evacuated climbers and villagers.',
    evacProtocol: 'Standard destination for Mustang helicopter medevacs landing at Pokhara International or Old Airport.',
    emergencyPhone: '+977-61-520067'
  },
  {
    id: 'pokhara-manipal-hospital',
    title: 'Manipal Teaching Hospital Emergency',
    nativeName: 'मनिपाल शिक्षण अस्पताल (पोखरा)',
    category: 'hospital',
    position: { lat: 28.2435, lng: 84.0042 },
    elevationM: 840,
    corridor: 'pokhara',
    facilityType: 'Private Tertiary Teaching Hospital',
    description: 'Comprehensive ICU, hyperbaric oxygen chambers, cardiology, neurosurgery, and international travel insurance coordination.',
    evacProtocol: 'Private rescue helicopters frequently land at nearby landing sites with rapid ambulance liaison.',
    emergencyPhone: '+977-61-526416'
  },
  {
    id: 'ciwec-clinic-ktm',
    title: 'CIWEC Hospital & Travel Medicine Center',
    nativeName: 'सिभिक क्लिनिक काठमाडौं',
    category: 'hospital',
    position: { lat: 27.7172, lng: 85.3188 },
    elevationM: 1400,
    corridor: 'kathmandu',
    facilityType: 'International High-Altitude Medicine & Travel Clinic',
    description: 'World-renowned authority on Himalayan altitude sickness, HAPE, HACE, and tropical infections. Direct liaison with global medical evacuation insurers.',
    evacProtocol: 'Receives international patient transfers from TIA (Tribhuvan International Airport).',
    emergencyPhone: '+977-1-4424111'
  },
  {
    id: 'patan-hospital-ktm',
    title: 'Patan Hospital Emergency & Trauma Care',
    nativeName: 'पाटन अस्पताल',
    category: 'hospital',
    position: { lat: 27.6683, lng: 85.3216 },
    elevationM: 1380,
    corridor: 'kathmandu',
    facilityType: 'Tertiary Academic Medical Center',
    description: 'High-volume emergency trauma center with comprehensive intensive care, pediatric ICU, and surgical departments.',
    evacProtocol: 'Central valley receiving facility for national public health and volunteer team evacuations.',
    emergencyPhone: '+977-1-5522295'
  },

  // Dolakha Corridor
  {
    id: 'bigu-nunnery-clinic',
    title: 'Bigu Nunnery Health Clinic (Tashi Chime Gatsal)',
    nativeName: 'བི་གུ་ བཙུན་དགོན་ སྨན་ཁང༌།',
    category: 'clinic',
    position: { lat: 27.7812, lng: 86.1724 },
    elevationM: 2500,
    corridor: 'dolakha',
    facilityType: 'Monastic Community Clinic & First Aid Post',
    description: 'High ridge sanctuary in Dolakha serving elderly Tibetan Buddhist nuns and local Sherpa/Tamang farming hamlets. Basic primary care and medication dispensary.',
    evacProtocol: 'Staging to Singati Bazaar (river gorge) or emergency hillside helipad.'
  },
  {
    id: 'bigu-helipad',
    title: 'Bigu Upper Helipad Ground',
    nativeName: 'བི་གུ་ ཐད་འཕུར་ཐང༌།',
    category: 'helipad',
    position: { lat: 27.7830, lng: 86.1750 },
    elevationM: 2540,
    corridor: 'dolakha',
    facilityType: 'Mountain Ridge Helipad',
    description: 'Grass clearing above the monastery courtyard. Used for emergency evacuation of critical nuns or trauma patients during monsoon road blockages.',
    evacProtocol: 'Helicopter transfer direct to Kathmandu (20 min flight time).'
  },
  {
    id: 'charikot-hospital',
    title: 'Charikot Primary Hospital (Dolakha)',
    nativeName: 'चरीकोट अस्पताल',
    category: 'hospital',
    position: { lat: 27.6698, lng: 86.0371 },
    elevationM: 1970,
    corridor: 'dolakha',
    facilityType: 'District Primary Hospital',
    description: 'Main public referral hospital in Dolakha district. Equipped with emergency triage, X-ray, minor surgery, and basic obstetrics.',
    evacProtocol: '3.5 hour overland ambulance drive to Kathmandu via Araniko Highway.',
    emergencyPhone: '+977-49-421122'
  }
];

export const MapsGroundingModule: React.FC = () => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "AIzaSyDM1BNg-GbSDZEGMzzIneeF78gcOZqD7c0";

  const [query, setQuery] = useState(
    'Find the nearest emergency medical referral hospitals in Pokhara and Kathmandu, plus helipad coordinates in Tsarang and Lo Manthang for acute altitude sickness evacuation.'
  );
  const [origin, setOrigin] = useState('Kathmandu (KTM)');
  const [destination, setDestination] = useState('Upper Mustang (Lo Manthang / Tsarang)');
  const [category, setCategory] = useState<'evac_hospital' | 'route_transit' | 'monastery_access' | 'road_hazard'>('evac_hospital');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MapsGroundingResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Map state
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(EXPEDITION_WAYPOINTS[0]);
  const [mapType, setMapType] = useState<'terrain' | 'hybrid' | 'roadmap'>('terrain');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hospital' | 'helipad' | 'clinic' | 'pass'>('all');
  
  // Center coordinates: Default to Upper Mustang & Annapurna region
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 28.95, lng: 83.95 });
  const [mapZoom, setMapZoom] = useState<number>(9);

  const samplePresets = [
    {
      title: 'Emergency Evacuation & Helipads',
      category: 'evac_hospital' as const,
      query: 'Find the nearest emergency medical referral hospitals in Pokhara and Kathmandu, plus helipad coordinates in Tsarang and Lo Manthang for acute altitude sickness evacuation.',
      destination: 'Upper Mustang (Lo Manthang / Tsarang)',
      focusCenter: { lat: 29.12, lng: 83.94 },
      focusZoom: 10
    },
    {
      title: 'Kathmandu to Lo Manthang Overland Route',
      category: 'route_transit' as const,
      query: 'What is the overland 4WD driving route, road surface status, distances, and waypoint elevations from Kathmandu to Jomsom and Lo Manthang?',
      destination: 'Lo Manthang (3,840m)',
      focusCenter: { lat: 28.75, lng: 84.1 },
      focusZoom: 8
    },
    {
      title: 'Kathmandu to Bigu Nunnery (Dolakha)',
      category: 'monastery_access' as const,
      query: 'What is the road condition, distance, transit time, and trailhead access from Kathmandu to Bigu Nunnery (Tashi Chime Gatsal) in Dolakha?',
      destination: 'Bigu Nunnery, Dolakha (2,500m)',
      focusCenter: { lat: 27.75, lng: 86.1 },
      focusZoom: 10
    },
    {
      title: 'Jomsom Flight vs Overland Road Hazards',
      category: 'road_hazard' as const,
      query: 'What are the seasonal flight constraints at Jomsom Airport (JMO) and river crossing risks along the Kali Gandaki highway?',
      destination: 'Jomsom Airport (2,743m)',
      focusCenter: { lat: 28.78, lng: 83.73 },
      focusZoom: 11
    }
  ];

  const handleRunMapsGrounding = async (customQuery?: string, customCategory?: string, customDest?: string) => {
    const q = customQuery || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const data = await fetchMapsExpeditionAI({
        query: q,
        expeditionOrigin: origin,
        destination: customDest || destination,
        category: customCategory || category,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredWaypoints = EXPEDITION_WAYPOINTS.filter((wp) => {
    if (categoryFilter === 'all') return true;
    return wp.category === categoryFilter;
  });

  const getCategoryPinColor = (cat: Waypoint['category']) => {
    switch (cat) {
      case 'hospital':
        return { background: '#e11d48', glyphColor: '#ffffff', borderColor: '#881337' }; // red
      case 'helipad':
        return { background: '#0284c7', glyphColor: '#ffffff', borderColor: '#075985' }; // sky blue
      case 'clinic':
        return { background: '#10b981', glyphColor: '#ffffff', borderColor: '#064e3b' }; // emerald
      case 'pass':
        return { background: '#f59e0b', glyphColor: '#ffffff', borderColor: '#78350f' }; // amber
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-sky-950/70 to-stone-900 border border-sky-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Google Maps Platform &amp; Grounded AI</span>
            </span>
            <span className="text-stone-400 text-xs">gemini-3.5-flash &bull; Live Interactive Map Layer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white flex items-center gap-2">
            <span>Himalayan Expedition Maps &amp; Evacuation Geospatial Atlas</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Live interactive Google Maps Platform visualization of high-altitude landing zones, remote monastic clinics, tertiary referral hospitals, and transit passes across Upper Mustang and Dolakha.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 text-xs flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-stone-200">Google Maps Active</div>
              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>API Key Loaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE GOOGLE MAPS COMPONENT */}
      <div className="bg-stone-900/90 border border-sky-900/50 rounded-2xl overflow-hidden shadow-2xl space-y-0">
        {/* Map Control Bar */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-stone-200 font-cinzel">Expedition Ground Layer</span>
            <span className="text-[11px] text-stone-400 font-mono">({filteredWaypoints.length} waypoints plotted)</span>
          </div>

          {/* Quick Focus Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-500 text-[11px] mr-1 hidden sm:inline">Corridor Focus:</span>
            <button
              onClick={() => {
                setMapCenter({ lat: 29.12, lng: 83.94 });
                setMapZoom(10);
                setSelectedWaypoint(EXPEDITION_WAYPOINTS[0]);
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-[11px] font-semibold transition-colors border border-amber-500/30"
            >
              Upper Mustang
            </button>
            <button
              onClick={() => {
                setMapCenter({ lat: 28.23, lng: 83.99 });
                setMapZoom(12);
                setSelectedWaypoint(EXPEDITION_WAYPOINTS[6]);
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-rose-300 text-[11px] font-semibold transition-colors border border-rose-500/30"
            >
              Pokhara Medevac
            </button>
            <button
              onClick={() => {
                setMapCenter({ lat: 27.70, lng: 85.32 });
                setMapZoom(12);
                setSelectedWaypoint(EXPEDITION_WAYPOINTS[8]);
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-sky-300 text-[11px] font-semibold transition-colors border border-sky-500/30"
            >
              Kathmandu Valley
            </button>
            <button
              onClick={() => {
                setMapCenter({ lat: 27.75, lng: 86.12 });
                setMapZoom(10);
                setSelectedWaypoint(EXPEDITION_WAYPOINTS[10]);
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-300 text-[11px] font-semibold transition-colors border border-emerald-500/30"
            >
              Dolakha Bigu
            </button>
            <button
              onClick={() => {
                setMapCenter({ lat: 28.5, lng: 84.8 });
                setMapZoom(7.5);
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-[11px] transition-colors border border-stone-700"
            >
              Full Arc
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2 py-1 rounded-md transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-stone-850 text-stone-400 hover:text-stone-200'
              }`}
            >
              All ({EXPEDITION_WAYPOINTS.length})
            </button>
            <button
              onClick={() => setCategoryFilter('hospital')}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                categoryFilter === 'hospital'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-stone-850 text-rose-300/80 hover:text-rose-200'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Hospitals</span>
            </button>
            <button
              onClick={() => setCategoryFilter('helipad')}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                categoryFilter === 'helipad'
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-stone-850 text-sky-300/80 hover:text-sky-200'
              }`}
            >
              <Plane className="w-3 h-3" />
              <span>Helipads</span>
            </button>
            <button
              onClick={() => setCategoryFilter('clinic')}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                categoryFilter === 'clinic'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-stone-850 text-emerald-300/80 hover:text-emerald-200'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Clinics</span>
            </button>
          </div>
        </div>

        {/* Map Container Viewport */}
        <div className="relative w-full h-[520px] bg-stone-950">
          <APIProvider apiKey={apiKey}>
            <Map
              center={mapCenter}
              zoom={mapZoom}
              mapTypeId={mapType}
              style={{ width: '100%', height: '100%' }}
              mapId="himalayan_expedition_map"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {filteredWaypoints.map((wp) => {
                const pinStyle = getCategoryPinColor(wp.category);
                const isSelected = selectedWaypoint?.id === wp.id;

                return (
                  <AdvancedMarker
                    key={wp.id}
                    position={wp.position}
                    onClick={() => {
                      setSelectedWaypoint(wp);
                      setMapCenter(wp.position);
                    }}
                    title={wp.title}
                  >
                    <Pin
                      background={isSelected ? '#38bdf8' : pinStyle.background}
                      glyphColor={pinStyle.glyphColor}
                      borderColor={isSelected ? '#0284c7' : pinStyle.borderColor}
                      scale={isSelected ? 1.3 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}

              {selectedWaypoint && (
                <InfoWindow
                  position={selectedWaypoint.position}
                  onCloseClick={() => setSelectedWaypoint(null)}
                  pixelOffset={[0, -34]}
                >
                  <div className="p-1 max-w-[280px] text-stone-900 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-1">
                      <span className="font-bold text-xs text-stone-900 leading-tight">
                        {selectedWaypoint.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-stone-100 text-stone-700">
                        {selectedWaypoint.category}
                      </span>
                    </div>

                    <div className="text-[11px] font-tibetan text-amber-900 font-semibold">
                      {selectedWaypoint.nativeName}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-stone-600 font-mono">
                      <span>{selectedWaypoint.elevationM.toLocaleString()} m</span>
                      <span>&bull;</span>
                      <span>{Math.round(selectedWaypoint.elevationM * 3.28084).toLocaleString()} ft</span>
                    </div>

                    <p className="text-[11px] text-stone-700 leading-snug">
                      {selectedWaypoint.description}
                    </p>

                    <div className="bg-sky-50 p-1.5 rounded text-[10px] text-sky-950 font-medium">
                      <strong>Evac Protocol:</strong> {selectedWaypoint.evacProtocol}
                    </div>

                    {selectedWaypoint.emergencyPhone && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-rose-700 font-semibold pt-0.5">
                        <PhoneCall className="w-3 h-3" />
                        <span>{selectedWaypoint.emergencyPhone}</span>
                      </div>
                    )}

                    <div className="pt-1 flex items-center justify-between">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedWaypoint.position.lat},${selectedWaypoint.position.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 underline"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-[9px] text-stone-500 font-mono">
                        {selectedWaypoint.position.lat.toFixed(4)}, {selectedWaypoint.position.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Map Floating Legend / Category Indicators */}
          <div className="absolute bottom-4 left-4 z-10 bg-stone-900/90 backdrop-blur-md border border-stone-800 p-2.5 rounded-xl text-[10px] text-stone-300 shadow-xl flex flex-col gap-1.5">
            <div className="font-bold text-stone-200 uppercase tracking-wider text-[9px] flex items-center gap-1">
              <Compass className="w-3 h-3 text-sky-400" />
              <span>Map Legend</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Tertiary Referral Hospitals (Pokhara / KTM / Jomsom)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>Helipads &amp; High-Altitude LZs (06:00 - 10:30 AM)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Field Clinics &amp; Monastic Health Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Passes, Gorges &amp; Checkpoints</span>
            </div>
          </div>
        </div>

        {/* Selected Waypoint Detail Card */}
        {selectedWaypoint && (
          <div className="bg-stone-950 p-4 border-t border-stone-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="md:col-span-1 border-r border-stone-900 pr-3">
              <div className="text-[10px] text-sky-400 font-mono uppercase tracking-wider">Active Pin Details</div>
              <div className="font-bold text-stone-100 text-sm mt-0.5">{selectedWaypoint.title}</div>
              <div className="font-tibetan text-amber-300 text-xs mt-0.5">{selectedWaypoint.nativeName}</div>
              <div className="text-[11px] text-stone-400 mt-1 font-mono">
                Elevation: <span className="text-emerald-400 font-semibold">{selectedWaypoint.elevationM}m</span> ({Math.round(selectedWaypoint.elevationM * 3.28084)} ft)
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5 border-r border-stone-900 pr-3">
              <div className="text-[10px] text-stone-400 font-semibold uppercase">Operational &amp; Medical Scope:</div>
              <p className="text-stone-300 text-xs leading-relaxed">
                {selectedWaypoint.description}
              </p>
              <div className="text-[11px] text-amber-300/90 font-medium bg-amber-950/40 p-2 rounded-lg border border-amber-900/30">
                <strong>Aviation / Transit Directive:</strong> {selectedWaypoint.evacProtocol}
              </div>
            </div>

            <div className="md:col-span-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase">GPS Coordinates:</div>
                <div className="font-mono text-stone-200 text-xs mt-0.5">
                  {selectedWaypoint.position.lat.toFixed(4)}° N, {selectedWaypoint.position.lng.toFixed(4)}° E
                </div>
                {selectedWaypoint.emergencyPhone && (
                  <div className="text-[11px] text-rose-300 font-mono mt-1">
                    Emergency: {selectedWaypoint.emergencyPhone}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedWaypoint.position.lat},${selectedWaypoint.position.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Preset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(preset.query);
              setCategory(preset.category);
              setDestination(preset.destination);
              setMapCenter(preset.focusCenter);
              setMapZoom(preset.focusZoom);
              handleRunMapsGrounding(preset.query, preset.category, preset.destination);
            }}
            className="p-3.5 rounded-xl text-left bg-stone-900/80 hover:bg-stone-850 border border-stone-800 hover:border-sky-500/50 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs mb-1">
                <MapPin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>{preset.title}</span>
              </div>
              <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                {preset.query}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-sky-400/80 font-medium mt-3">
              <span>Center Map &amp; Run AI Query</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Maps AI Query Studio */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-cinzel text-sky-200 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              Expedition Geospatial &amp; Route Navigator
            </h2>
            <p className="text-xs text-stone-400">
              Query real-time geographic data grounded with Google Maps (gemini-3.5-flash with googleMaps tool) for transit hours, road statuses, or hospital referral coordinates.
            </p>
          </div>

          <button
            onClick={() => handleRunMapsGrounding()}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-lg shadow-sky-950/40"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Grounding via Google Maps...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze with Google Maps AI</span>
              </>
            )}
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">Expedition Origin</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Target Himalayan Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Logistical Priority</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-sky-500"
            >
              <option value="evac_hospital">Emergency Evacuation &amp; Helipads</option>
              <option value="route_transit">4WD Driving &amp; Trekking Transit</option>
              <option value="monastery_access">Remote Monastery &amp; Clinic Trailheads</option>
              <option value="road_hazard">River Crossings &amp; Weather Closures</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-stone-300 font-semibold mb-1 text-xs">
            Geospatial Query / Expedition Brief
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about mountain passes, road conditions, helipad coordinates, or hospital referral times..."
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-sky-500 resize-none font-sans"
            />
            <Search className="w-4 h-4 text-stone-500 absolute right-3 bottom-4" />
          </div>
        </div>

        {/* AI Result Card */}
        {result && (
          <div className="bg-stone-950 rounded-xl p-5 border border-sky-800/40 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-stone-200">
                    Google Maps Grounded Field Analysis
                  </h4>
                  <span className="text-[10px] text-stone-500 font-mono">
                    Model: gemini-3.5-flash &bull; Evaluated {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <button
                onClick={copyResult}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors border border-stone-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Markdown Answer */}
            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
              {result.answer}
            </div>

            {/* Grounding Metadata */}
            {result.groundingMetadata?.webSearchQueries && (
              <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-sky-400" />
                <span>Grounded with Google Maps Queries:</span>
                <span className="font-mono text-stone-300">
                  {result.groundingMetadata.webSearchQueries.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Visual Himalayan Corridor Atlas */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-cinzel text-sky-200 flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>Key Himalayan Expedition Corridors &amp; Elevations</span>
          </h3>
          <span className="text-xs text-stone-400">Mustang &amp; Dolakha Sectors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Upper Mustang Corridor Card */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 text-sm">Upper Mustang Gateway Corridor</span>
              <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">425 km Overland</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-stone-300 pb-1 border-b border-stone-900">
                <span>1. Pokhara (Domestic Hub)</span>
                <span className="font-mono text-stone-400">820m &bull; Tertiary Hospitals</span>
              </div>
              <div className="flex items-center justify-between text-stone-300 pb-1 border-b border-stone-900">
                <span>2. Jomsom Airport (JMO)</span>
                <span className="font-mono text-amber-300">2,743m &bull; STOL Mountain Runway</span>
              </div>
              <div className="flex items-center justify-between text-stone-300 pb-1 border-b border-stone-900">
                <span>3. Kagbeni Checkpost</span>
                <span className="font-mono text-sky-300">2,800m &bull; Acclimatization Staging</span>
              </div>
              <div className="flex items-center justify-between text-stone-300 pb-1 border-b border-stone-900">
                <span>4. Tsarang Health Post</span>
                <span className="font-mono text-emerald-300">3,560m &bull; Helipad &amp; Dental Hub</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>5. Lo Manthang &amp; Tsonup Clinic</span>
                <span className="font-mono text-rose-300">3,850m &bull; High Altitude Triage</span>
              </div>
            </div>
          </div>

          {/* Dolakha Bigu Corridor Card */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 text-sm">Dolakha Bigu Nunnery Corridor</span>
              <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">185 km Overland</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-stone-300 pb-1 border-b border-stone-900">
                <span>1. Kathmandu (Base HQ)</span>
                <span className="font-mono text-stone-400">1,400m &bull; CIWEC &amp; Patan Hospital</span>
              </div>
              <div className="flex items-center justify-between text-stone-300 pb-1 border-b border-stone-900">
                <span>2. Charikot (District HQ)</span>
                <span className="font-mono text-sky-300">1,970m &bull; District Hospital</span>
              </div>
              <div className="flex items-center justify-between text-stone-300 pb-1 border-b border-stone-900">
                <span>3. Singati Bazaar (River Gorge)</span>
                <span className="font-mono text-amber-300">950m &bull; Hydropower Helipad</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>4. Bigu Nunnery (Tashi Chime Gatsal)</span>
                <span className="font-mono text-emerald-300">2,500m &bull; 4WD / Mule Trail Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
