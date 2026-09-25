import React, { useState } from 'react';
import { MONASTERY_ARCHIVES } from '../data/hgoData.ts';
import { MonasteryArchive } from '../types/index.ts';
import { 
  Mountain, 
  Sparkles, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  HeartHandshake, 
  ArrowRight,
  Sun,
  ShieldCheck,
  Compass,
  ChevronRight
} from 'lucide-react';

interface MonasteryArchiveModuleProps {
  onSponsorInitiative: (monasteryName: string, projectTitle: string, suggestedAmount: number) => void;
}

export const MonasteryArchiveModule: React.FC<MonasteryArchiveModuleProps> = ({
  onSponsorInitiative,
}) => {
  const [selectedMonastery, setSelectedMonastery] = useState<MonasteryArchive>(MONASTERY_ARCHIVES[0]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-stone-900 to-stone-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
              Heritage Preservation &amp; Monastic Support
            </span>
            <span className="text-stone-400 text-xs">Dolakha &amp; Upper Mustang Sacred Sites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white flex items-center gap-2">
            Himalayan Monastery &amp; Nunnery Archive
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Preserving centuries-old Buddhist heritage, medieval medical xylographs, and supporting resident nuns and monks with clean water and solar thermal heating.
          </p>
        </div>

        <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 text-xs flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-stone-200">Winter Resilience Focus</div>
            <div className="text-[11px] text-stone-400">Passive Solar Heating &amp; Clean Water</div>
          </div>
        </div>
      </div>

      {/* Grid of Monasteries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MONASTERY_ARCHIVES.map((m) => {
          const percentFunded = Math.round((m.raisedFundingUSD / m.targetFundingUSD) * 100);
          const isSelected = selectedMonastery.id === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setSelectedMonastery(m)}
              className={`cursor-pointer bg-stone-900/80 rounded-2xl border p-5 flex flex-col justify-between transition-all hover:border-amber-500/60 shadow-lg ${
                isSelected
                  ? 'border-amber-500 ring-1 ring-amber-500/50 shadow-amber-950/40'
                  : 'border-stone-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-mono">
                    {m.altitudeMeters}m
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      m.restorationStatus === 'Urgent Appeal'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {m.restorationStatus}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-stone-100 leading-snug">
                  {m.name}
                </h3>
                <div className="font-tibetan text-amber-300/80 text-xs mb-3">
                  {m.nameTibetan}
                </div>

                <p className="text-xs text-stone-400 mb-4 line-clamp-3">
                  {m.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Funding Progress</span>
                    <span className="font-bold text-amber-300">{percentFunded}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                      style={{ width: `${Math.min(100, percentFunded)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>${m.raisedFundingUSD.toLocaleString()} raised</span>
                    <span>Goal: ${m.targetFundingUSD.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{m.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-300">
                  <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Resident Community: <strong>{m.communityMembers}</strong> ({m.tradition})</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMonastery(m);
                  }}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <span>Inspect Preservation Projects</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Monastery Deep View & Action Matrix */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-stone-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {selectedMonastery.tradition} Lineage • Est. {selectedMonastery.establishedCentury}
            </span>
            <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
              {selectedMonastery.name}
            </h2>
            <div className="font-tibetan text-amber-300 text-base">
              {selectedMonastery.nameTibetan}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-amber-400">
              ${(selectedMonastery.targetFundingUSD - selectedMonastery.raisedFundingUSD).toLocaleString()} needed to complete
            </div>
            <div className="text-xs text-stone-400">
              Altitude: {selectedMonastery.altitudeMeters} meters
            </div>
          </div>
        </div>

        {/* Heritage significance */}
        <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl space-y-1">
          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Spiritual &amp; Cultural Significance</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {selectedMonastery.heritageSignificance}
          </p>
        </div>

        {/* Priority Restoration Initiatives */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-cinzel text-amber-200">
            Active Preservation Projects &amp; Funding Needs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedMonastery.keyProjects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        proj.urgency === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {proj.urgency} Urgency
                    </span>
                    <span className="font-mono font-bold text-amber-300 text-xs">
                      ${proj.costUSD.toLocaleString()} USD
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-100 mb-1 leading-snug">
                    {proj.title}
                  </h4>
                  <p className="text-stone-400 text-[11px] leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <button
                  onClick={() => onSponsorInitiative(selectedMonastery.name, proj.title, proj.costUSD)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-md shadow-amber-900/30"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Sponsor This Initiative</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
