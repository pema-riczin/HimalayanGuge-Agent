import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { AgentConsole } from './components/AgentConsole.tsx';
import { FieldOpsModule } from './components/FieldOpsModule.tsx';
import { TriageModule } from './components/TriageModule.tsx';
import { CulturalCodexModule } from './components/CulturalCodexModule.tsx';
import { MonasteryArchiveModule } from './components/MonasteryArchiveModule.tsx';
import { ImpactEngineModule } from './components/ImpactEngineModule.tsx';
import { MobileFieldSimulator } from './components/MobileFieldSimulator.tsx';
import { PublicWidgetModal } from './components/PublicWidgetModal.tsx';
import { 
  getStoredInventory, 
  getStoredTriageRecords, 
  syncAllTriageRecords,
  resetToDummyData,
  getLowBandwidthMode, 
  setLowBandwidthMode as saveLowBandwidthMode 
} from './services/storage.ts';
import { InventoryItem, TriageRecord } from './types/index.ts';
import { 
  Compass, 
  Heart, 
  Mountain, 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('copilot');
  const [lowBandwidthMode, setLowBandwidthModeState] = useState<boolean>(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [triageRecords, setTriageRecords] = useState<TriageRecord[]>([]);
  const [isNetworkOnline, setIsNetworkOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
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
    suggestedAmount: number
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Regional Navigation */}
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

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
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

        {activeTab === 'impact' && (
          <ImpactEngineModule
            initialSponsorDetails={sponsorDetails}
          />
        )}
      </main>

      {/* Modals for Cross-Channel Simulator */}
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

      {/* Footer */}
      <footer className="no-print bg-stone-900 border-t border-stone-800 text-stone-400 text-xs py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-cinzel font-bold text-stone-200">
                Himalayan Guge Organization (HGO)
              </div>
              <div className="text-[11px] text-stone-400">
                Digital Co-Pilot &bull; Upper Mustang &bull; Dolakha &bull; Kathmandu Base
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-400">
            <span>Global Partners: <strong className="text-stone-300">JJoy Foundation</strong></span>
            <span>&bull;</span>
            <span><strong className="text-stone-300">Rotary International</strong></span>
            <span>&bull;</span>
            <span className="font-tibetan text-amber-300/80 text-xs">བཀྲ་ཤིས་བདེ་ལེགས། (Tashi Delek)</span>
          </div>

          <div className="text-stone-400 text-[11px]">
            &copy; 2026 Himalayan Guge Organization &bull; Sowa-Rigpa Preservation Lineage
          </div>
        </div>
      </footer>
    </div>
  );
}
