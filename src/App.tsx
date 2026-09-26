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
  MapPin,
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
    { id: 'triage', label: 'AMS & Health Triage', icon: Stethoscope, badge: unsyncedCount > 0 ? `${unsyncedCount} unsynced` : undefined },
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
    <header className="sticky top-0 z-40 border-b border-outline/25 bg-[color:var(--md-sys-color-surface)]/90 backdrop-blur-xl">
      <div className="border-b border-outline/20 bg-[color:var(--md-sys-color-surface-container-low)] px-4 py-2 text-[11px]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
            <span className="font-semibold uppercase tracking-[0.12em] text-primary">Active Sector:</span>
            <span>Upper Mustang (Lo Manthang 3,840m • Tsarang • Tsonup) & Bigu Nunnery</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 text-[11px] text-on-surface-variant sm:flex">
              <span>
                Partners: <strong className="text-on-surface">JJoy Foundation</strong> & <strong className="text-on-surface">Rotary Clubs</strong>
              </span>
              <span className="text-outline">|</span>
              <span className="font-tibetan text-primary">བོད་ཀྱི་གསོ་རིག་སྨན་ཁང་།</span>
            </div>

            <button
              onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                lowBandwidthMode
                  ? 'border-primary/30 bg-primary-container text-on-primary-container'
                  : 'border-outline bg-surface text-on-surface hover:bg-surface-container'
              }`}
              title="Toggle Low-Bandwidth Mode for remote satellite or offline field use"
            >
              {lowBandwidthMode ? (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  <span>Low-Bandwidth</span>
                </>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Standard Broadband</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {dummyNotification && (
        <div className="flex items-center justify-center gap-2 border-b border-amber-500/40 bg-amber-500 px-4 py-1.5 text-center text-[11px] font-semibold text-amber-950">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{dummyNotification}</span>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-container text-primary shadow-md shadow-primary/15">
            <Compass className="h-6 w-6" />
            <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-surface ${isNetworkOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg font-bold tracking-[0.08em] text-on-surface">HGO-Agent</span>
              <span className="rounded-full border border-primary/30 bg-primary-container px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                AI Co-Pilot
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              Himalayan Guge Organization • <span className="font-tibetan text-primary">ཧི་མ་ལ་ཡའི་གུ་གེ་ཚོགས་པ།</span>
            </p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('triage')}
          className={`hidden cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm transition-all sm:flex ${
            isNetworkOnline
              ? unsyncedCount > 0
                ? 'border-amber-500/30 bg-amber-50 hover:bg-amber-100'
                : 'border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100'
              : 'border-rose-500/30 bg-rose-50 hover:bg-rose-100'
          }`}
          title="Triage records sync status. Click to open Triage Station."
        >
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              {isNetworkOnline ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
              )}
            </span>

            <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${isNetworkOnline ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isNetworkOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <span className="text-outline">|</span>

          <div className="flex items-center gap-1.5 text-xs">
            <Stethoscope className="h-3.5 w-3.5 text-on-surface-variant" />
            <span className="font-medium text-on-surface">
              {isNetworkOnline ? (
                unsyncedCount === 0 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Synced
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-700">
                    <AlertCircle className="h-3 w-3" />
                    {unsyncedCount} Pending
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-700">
                  <WifiOff className="h-3 w-3" />
                  {unsyncedCount > 0 ? `${unsyncedCount} Cached` : 'Cache Ready'}
                </span>
              )}
            </span>
          </div>

          {isNetworkOnline && unsyncedCount > 0 && onSyncTriage && (
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-on-primary shadow-sm transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              title="Sync pending triage records now"
            >
              <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            onClick={() => setActiveTab('triage')}
            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold sm:hidden ${
              isNetworkOnline
                ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700'
                : 'border-rose-500/30 bg-rose-50 text-rose-700'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isNetworkOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span>{isNetworkOnline ? 'Online' : 'Offline'}</span>
            {unsyncedCount > 0 && <span className="rounded-full bg-amber-100 px-1 text-[9px] text-amber-700">{unsyncedCount}</span>}
          </div>

          <button
            onClick={onOpenMobileSim}
            className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-surface px-3 py-2 text-xs font-medium text-on-surface transition-all hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Smartphone className="h-3.5 w-3.5 text-primary" />
            <span className="hidden md:inline">Field Mobile Bot</span>
            <span className="md:hidden">Field Bot</span>
          </button>

          <button
            onClick={onOpenPublicWidget}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-container px-3 py-2 text-xs font-medium text-on-primary-container transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Web Widget Preview</span>
            <span className="md:hidden">Widget</span>
          </button>

          {onResetDummyData && (
            <button
              onClick={onResetDummyData}
              className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-surface px-2.5 py-2 text-xs font-semibold text-primary transition-all hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              title="Reset and reload fresh sample dataset (clinics, inventory, triage records)"
            >
              <Database className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Reset Demo Data</span>
              <span className="lg:hidden">Demo Data</span>
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-2">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-surface-container p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface hover:text-on-surface'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : tab.badge.includes('unsynced')
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-secondary-container text-on-secondary-container'
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

