import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { AgentConsole } from './components/AgentConsole.tsx';
import { FieldOpsModule } from './components/FieldOpsModule.tsx';
import { TriageModule } from './components/TriageModule.tsx';
import { CulturalCodexModule } from './components/CulturalCodexModule.tsx';
import { MonasteryArchiveModule } from './components/MonasteryArchiveModule.tsx';
import { ImpactEngineModule } from './components/ImpactEngineModule.tsx';
import { MapsGroundingModule } from './components/MapsGroundingModule.tsx';
import { MobileFieldSimulator } from './components/MobileFieldSimulator.tsx';
import { PublicWidgetModal } from './components/PublicWidgetModal.tsx';
import {
  getStoredInventory,
  getStoredTriageRecords,
  syncAllTriageRecords,
  resetToDummyData,
  getLowBandwidthMode,
  setLowBandwidthMode as saveLowBandwidthMode,
} from './services/storage.ts';
import { InventoryItem, TriageRecord } from './types/index.ts';
import { Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('copilot');
  const [lowBandwidthMode, setLowBandwidthModeState] = useState<boolean>(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [triageRecords, setTriageRecords] = useState<TriageRecord[]>([]);
  const [isNetworkOnline, setIsNetworkOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  const [showMobileSim, setShowMobileSim] = useState<boolean>(false);
  const [showPublicWidget, setShowPublicWidget] = useState<boolean>(false);

  const [sponsorDetails, setSponsorDetails] = useState<{
    monasteryName: string;
    projectTitle: string;
    suggestedAmount: number;
  } | null>(null);

  useEffect(() => {
    setInventory(getStoredInventory());
    setTriageRecords(getStoredTriageRecords());
    setLowBandwidthModeState(getLowBandwidthMode());

    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSyncTriage = () => {
    const { updated } = syncAllTriageRecords();
    setTriageRecords(updated);
  };

  const handleToggleLowBandwidth = (enabled: boolean) => {
    setLowBandwidthModeState(enabled);
    saveLowBandwidthMode(enabled);
  };

  const handleSponsorInitiative = (
    monasteryName: string,
    projectTitle: string,
    suggestedAmount: number,
  ) => {
    setSponsorDetails({ monasteryName, projectTitle, suggestedAmount });
    setActiveTab('impact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [dummyNotification, setDummyNotification] = useState<string | null>(null);

  const handleResetDummyData = () => {
    const { inventory: newInv, triage: newTriage } = resetToDummyData();
    setInventory(newInv);
    setTriageRecords(newTriage);
    setDummyNotification('Demo Dataset Loaded: 6 clinics, 17 inventory lines & 6 triage records refreshed');
    setTimeout(() => setDummyNotification(null), 3500);
  };

  const unsyncedCount = triageRecords.filter((r) => !r.synced).length;

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowBandwidthMode={lowBandwidthMode}
        setLowBandwidthMode={handleToggleLowBandwidth}
        onOpenMobileSim={() => setShowMobileSim(true)}
        onOpenPublicWidget={() => setShowPublicWidget(true)}
        unsyncedCount={unsyncedCount}
        isNetworkOnline={isNetworkOnline}
        onSyncTriage={handleSyncTriage}
        onResetDummyData={handleResetDummyData}
        dummyNotification={dummyNotification}
      />

      <main className="mx-auto max-w-7xl flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {activeTab === 'copilot' && (
          <AgentConsole
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            lowBandwidthMode={lowBandwidthMode}
          />
        )}

        {activeTab === 'field_ops' && (
          <FieldOpsModule
            inventory={inventory}
            setInventory={setInventory}
          />
        )}

        {activeTab === 'triage' && (
          <TriageModule
            records={triageRecords}
            setRecords={setTriageRecords}
            lowBandwidthMode={lowBandwidthMode}
          />
        )}

        {activeTab === 'cultural_codex' && (
          <CulturalCodexModule />
        )}

        {activeTab === 'heritage' && (
          <MonasteryArchiveModule
            onSponsorInitiative={handleSponsorInitiative}
          />
        )}

        {activeTab === 'maps_grounding' && (
          <MapsGroundingModule />
        )}

        {activeTab === 'impact' && (
          <ImpactEngineModule
            initialSponsorDetails={sponsorDetails}
          />
        )}
      </main>

      {showMobileSim && (
        <MobileFieldSimulator onClose={() => setShowMobileSim(false)} />
      )}

      {showPublicWidget && (
        <PublicWidgetModal
          onClose={() => setShowPublicWidget(false)}
          onOpenDonate={(amount, initiative) => {
            setShowPublicWidget(false);
            setSponsorDetails({
              monasteryName: 'HGO Core Healthcare',
              projectTitle: initiative,
              suggestedAmount: amount,
            });
            setActiveTab('impact');
          }}
        />
      )}

      <footer className="no-print border-t border-outline/20 bg-[color:var(--md-sys-color-surface-container-low)] text-on-surface-variant">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-primary shadow-sm">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="font-cinzel text-base font-bold tracking-[0.08em] text-on-surface">
                Himalayan Guge Organization (HGO)
              </div>
              <div className="text-[11px] text-on-surface-variant">
                Digital Co-Pilot • Upper Mustang • Dolakha • Kathmandu Base
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-on-surface-variant">
            <span>Global Partners: <strong className="text-on-surface">JJoy Foundation</strong></span>
            <span>•</span>
            <span><strong className="text-on-surface">Rotary International</strong></span>
            <span>•</span>
            <span className="font-tibetan text-primary">བཀྲ་ཤིས་བདེ་ལེགས། (Tashi Delek)</span>
          </div>

          <div className="text-[11px] text-on-surface-variant">
            © 2026 Himalayan Guge Organization • Sowa-Rigpa Preservation Lineage
          </div>
        </div>
      </footer>
    </div>
  );
}






















































































































































































































































































































































































































































































































































































































