import React, { useState } from 'react';
import { 
  Compass, 
  Wifi, 
  WifiOff, 
  Mountain, 
  Sparkles, 
  Smartphone, 
  Globe, 
  Stethoscope, 
  BookOpen, 
  HeartHandshake, 
  Layers,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  RefreshCw,
  Database,
  MapPin
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lowBandwidthMode: boolean;
  setLowBandwidthMode: (val: boolean) => void;
  onOpenMobileSim: () => void;
  onOpenPublicWidget: () => void;
  unsyncedCount: number;
  isNetworkOnline: boolean;
  onSyncTriage?: () => void;
  onResetDummyData?: () => void;
  dummyNotification?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lowBandwidthMode,
  setLowBandwidthMode,
  onOpenMobileSim,
  onOpenPublicWidget,
  unsyncedCount,
  isNetworkOnline,
  onSyncTriage,
  onResetDummyData,
  dummyNotification,
}) => {
  const [syncing, setSyncing] = useState(false);

  const tabs = [
    { id: 'copilot', label: 'AI Co-Pilot', icon: Sparkles, badge: 'Gemini 3.8' },
    { id: 'field_ops', label: 'Field Ops & Clinics', icon: Layers },
    { id: 'triage', label: 'AMS & Health Triage', icon: Stethoscope, badge: unsyncedCount > 0 ? `${unsyncedCount} un-synced` : undefined },
    { id: 'cultural_codex', label: 'Sowa-Rigpa Codex', icon: BookOpen },
    { id: 'heritage', label: 'Monasteries & Nunneries', icon: Mountain },
    { id: 'maps_grounding', label: 'Expedition Maps AI', icon: MapPin, badge: 'Maps Grounded' },
    { id: 'impact', label: 'Impact & Donors', icon: HeartHandshake },
  ];

  const handleManualSync = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSyncTriage || !isNetworkOnline || syncing) return;
    setSyncing(true);
    setTimeout(() => {
      onSyncTriage();
      setSyncing(false);
    }, 400);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-xl">
      {/* Top Banner with Himalayan Context & Low Bandwidth Status */}
      <div className="bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 px-4 py-1.5 border-b border-amber-900/30 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-stone-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">Active Sector:</span>
          <span>Upper Mustang (Lo Manthang 3,840m • Tsarang • Tsonup) & Bigu Nunnery</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-stone-400 text-[11px]">
            <span>Partners: <strong className="text-stone-200">JJoy Foundation</strong> & <strong className="text-stone-200">Rotary Clubs</strong></span>
            <span className="text-stone-600">|</span>
            <span className="font-tibetan text-amber-300/80">བོད་ཀྱི་གསོ་རིག་སྨན་ཁང་།</span>
          </div>

          {/* Low Bandwidth Mode Toggle */}
          <button
            onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
              lowBandwidthMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-stone-800 text-stone-300 border border-stone-700 hover:border-stone-600'
            }`}
            title="Toggle Low-Bandwidth Mode for remote satellite or offline field use"
          >
            {lowBandwidthMode ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Low-Bandwidth (Satellite)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Standard Broadband</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Demo Data Loaded Notification Toast */}
      {dummyNotification && (
        <div className="bg-amber-600/90 border-b border-amber-500 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-center gap-2 shadow animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>{dummyNotification}</span>
        </div>
      )}

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-500/30 text-white shadow-lg shadow-amber-950/50">
            <Compass className="w-6 h-6 text-amber-200 animate-spin-slow" />
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-stone-900 rounded-full ${isNetworkOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg font-bold tracking-wider text-white">
                HGO-Agent
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Co-Pilot
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-tight">
              Himalayan Guge Organization • <span className="font-tibetan text-amber-200/90 text-xs">ཧི་མ་ལ་ཡའི་གུ་གེ་ཚོགས་པ།</span>
            </p>
          </div>
        </div>

        {/* Center: Visual Sync Status Indicator for TriageModule Records */}
        <div 
          onClick={() => setActiveTab('triage')}
          className={`cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shadow-sm ${
            isNetworkOnline
              ? unsyncedCount > 0
                ? 'bg-amber-950/50 border-amber-700/60 hover:bg-amber-950/80'
                : 'bg-emerald-950/40 border-emerald-800/50 hover:bg-emerald-950/60'
              : 'bg-rose-950/50 border-rose-800/60 hover:bg-rose-950/70'
          }`}
          title="Triage records sync status. Click to open Triage Station."
        >
          {/* Signal Indicator Dot */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              {isNetworkOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              )}
            </span>

            <span className={`text-xs font-bold uppercase tracking-wider ${isNetworkOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isNetworkOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <span className="text-stone-600">|</span>

          {/* Triage Sync State Text */}
          <div className="flex items-center gap-1.5 text-xs">
            <Stethoscope className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-300 font-medium">
              {isNetworkOnline ? (
                unsyncedCount === 0 ? (
                  <span className="text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Triage Records Synced
                  </span>
                ) : (
                  <span className="text-amber-300 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    {unsyncedCount} Triage Pending Sync
                  </span>
                )
              ) : (
                <span className="text-rose-300 flex items-center gap-1">
                  <WifiOff className="w-3 h-3 text-rose-400" />
                  {unsyncedCount > 0 ? `${unsyncedCount} Records Cached Offline` : 'Offline Cache Ready'}
                </span>
              )}
            </span>
          </div>

          {/* Inline Quick Sync Button if Online & Records Pending */}
          {isNetworkOnline && unsyncedCount > 0 && onSyncTriage && (
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="ml-1 px-2 py-0.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
              title="Sync pending triage records now"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}
        </div>

        {/* Channel Previews: Mobile Field Messenger & Public Web Widget */}
        <div className="flex items-center gap-2">
          {/* Mobile-only compact sync status badge */}
          <div 
            onClick={() => setActiveTab('triage')}
            className={`sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-bold ${
              isNetworkOnline
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-rose-950/60 border-rose-700/60 text-rose-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isNetworkOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span>{isNetworkOnline ? 'Online' : 'Offline'}</span>
            {unsyncedCount > 0 && (
              <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px]">
                {unsyncedCount}
              </span>
            )}
          </div>

          <button
            onClick={onOpenMobileSim}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Field Mobile Bot</span>
            <span className="md:hidden">Field Bot</span>
          </button>

          <button
            onClick={onOpenPublicWidget}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-700/40 hover:bg-amber-700/60 text-amber-200 border border-amber-600/40 transition-colors shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Web Widget Preview</span>
            <span className="md:hidden">Widget</span>
          </button>

          {onResetDummyData && (
            <button
              onClick={onResetDummyData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-amber-950/80 text-amber-300 hover:text-amber-200 border border-stone-700 hover:border-amber-600/50 transition-colors shadow-sm"
              title="Reset and reload fresh sample dataset (clinics, inventory, triage records)"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Reset Demo Data</span>
              <span className="lg:hidden">Demo Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex space-x-1 border-t border-stone-800/80 pt-1 pb-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-black/30 text-amber-200'
                        : tab.badge.includes('un-synced')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-stone-800 text-amber-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
