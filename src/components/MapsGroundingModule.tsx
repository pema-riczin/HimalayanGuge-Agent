import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

export const MapsGroundingModule: React.FC = () => {
  const [query, setQuery] = useState(
    'Find the nearest emergency medical referral hospitals in Pokhara and Kathmandu, plus helipad coordinates in Tsarang and Lo Manthang for acute altitude sickness evacuation.'
  );
  const [origin, setOrigin] = useState('Kathmandu (KTM)');
  const [destination, setDestination] = useState('Upper Mustang (Lo Manthang / Tsarang)');
  const [category, setCategory] = useState<'evac_hospital' | 'route_transit' | 'monastery_access' | 'road_hazard'>('evac_hospital');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MapsGroundingResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const samplePresets = [
    {
      title: 'Emergency Evacuation & Helipads',
      category: 'evac_hospital' as const,
      query: 'Find the nearest emergency medical referral hospitals in Pokhara and Kathmandu, plus helipad coordinates in Tsarang and Lo Manthang for acute altitude sickness evacuation.',
      destination: 'Upper Mustang (Lo Manthang / Tsarang)'
    },
    {
      title: 'Kathmandu to Lo Manthang Overland Route',
      category: 'route_transit' as const,
      query: 'What is the overland 4WD driving route, road surface status, distances, and waypoint elevations from Kathmandu to Jomsom and Lo Manthang?',
      destination: 'Lo Manthang (3,840m)'
    },
    {
      title: 'Kathmandu to Bigu Nunnery (Dolakha)',
      category: 'monastery_access' as const,
      query: 'What is the road condition, distance, transit time, and trailhead access from Kathmandu to Bigu Nunnery (Tashi Chime Gatsal) in Dolakha?',
      destination: 'Bigu Nunnery, Dolakha (2,500m)'
    },
    {
      title: 'Jomsom Flight vs Overland Road Hazards',
      category: 'road_hazard' as const,
      query: 'What are the seasonal flight constraints at Jomsom Airport (JMO) and river crossing risks along the Kali Gandaki highway?',
      destination: 'Jomsom Airport (2,743m)'
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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-sky-950/70 to-stone-900 border border-sky-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Google Maps Grounded AI</span>
            </span>
            <span className="text-stone-400 text-xs">Powered by gemini-3.5-flash with googleMaps tool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white flex items-center gap-2">
            <span>Himalayan Route &amp; Hospital Intelligence</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Real-time geospatial awareness for remote healthcare expeditions: hospital locations, landing zones, transit times, road conditions, and river crossings across Upper Mustang and Dolakha.
          </p>
        </div>

        <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-xs flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-stone-200">Maps Grounding Active</div>
            <div className="text-[11px] text-sky-400 font-mono">gemini-3.5-flash (googleMaps)</div>
          </div>
        </div>
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
              <span>Run Grounded Query</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Maps Query Studio */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-cinzel text-sky-200 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              Expedition Geospatial &amp; Route Navigator
            </h2>
            <p className="text-xs text-stone-400">
              Query geographic data grounded with Google Maps for transit hours, road statuses, or hospital referral coordinates.
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
            <label className="block text-stone-300 font-semibold mb-1">Logistics Focus</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-sky-500"
            >
              <option value="evac_hospital">Emergency Evacuation & Hospitals</option>
              <option value="route_transit">Overland Route & Transit Times</option>
              <option value="monastery_access">Monastery & Nunnery Trail Access</option>
              <option value="road_hazard">Seasonal Weather & River Hazards</option>
            </select>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-stone-300 font-semibold">
            Geographic / Navigation Query:
          </label>
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-stone-100 font-sans leading-relaxed focus:outline-none focus:border-sky-500"
            placeholder="Type your route question or hospital inquiry..."
          />
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-stone-950 p-6 rounded-2xl border border-sky-900/50 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Grounded Expedition Intelligence Report
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                  {result.source}
                </span>
              </div>

              <button
                onClick={copyResult}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Briefing</span>
                  </>
                )}
              </button>
            </div>

            {/* Markdown Answer */}
            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
              {result.answer}
            </div>

            {/* Grounding Metadata / Google Maps Attribution if available */}
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
