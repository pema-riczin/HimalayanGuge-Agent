import React, { useState } from 'react';
import { 
  ClinicSite, 
  InventoryItem 
} from '../types/index.ts';
import { CLINIC_SITES, VOLUNTEER_GEAR_CHECKLIST } from '../data/hgoData.ts';
import { 
  updateInventoryItemQuantity, 
  addInventoryItem 
} from '../services/storage.ts';
import { generateVolunteerBriefAI } from '../services/api.ts';
import { 
  Layers, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Filter, 
  Compass, 
  MapPin, 
  Users, 
  Radio, 
  Snowflake, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  RefreshCw,
  Clock,
  ShieldCheck,
  Package,
  ExternalLink
} from 'lucide-react';

interface FieldOpsModuleProps {
  inventory: InventoryItem[];
  setInventory: (items: InventoryItem[]) => void;
}

export const FieldOpsModule: React.FC<FieldOpsModuleProps> = ({
  inventory,
  setInventory,
}) => {
  const [selectedClinicId, setSelectedClinicId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterCriticalOnly, setFilterCriticalOnly] = useState<boolean>(false);

  // Volunteer Generator State
  const [volunteerSpecialty, setVolunteerSpecialty] = useState('Dentist (General & Oral Surgery)');
  const [travelMonth, setTravelMonth] = useState('October (Autumn Expedition)');
  const [durationWeeks, setDurationWeeks] = useState('2 weeks');
  const [briefLoading, setBriefLoading] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<string | null>(null);

  // New item modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('antibiotic');
  const [newItemClinic, setNewItemClinic] = useState('tsonup');
  const [newItemQty, setNewItemQty] = useState(20);
  const [newItemMin, setNewItemMin] = useState(15);
  const [newItemUnit, setNewItemUnit] = useState('boxes');
  const [newItemExp, setNewItemExp] = useState('2027-12');
  const [newItemWinter, setNewItemWinter] = useState(true);

  // Quick quantity change
  const handleQuantityAdjust = (id: string, delta: number) => {
    const updated = updateInventoryItemQuantity(id, delta);
    setInventory(updated);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      clinicId: newItemClinic,
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQty,
      minThreshold: newItemMin,
      unit: newItemUnit,
      expiryDate: newItemExp,
      criticalForWinter: newItemWinter,
      notes: 'Added from field ops command console'
    };

    const updated = addInventoryItem(item);
    setInventory(updated);
    setShowAddModal(false);
    setNewItemName('');
  };

  const handleGenerateBrief = async () => {
    setBriefLoading(true);
    try {
      const brief = await generateVolunteerBriefAI({
        specialty: volunteerSpecialty,
        travelMonth,
        durationWeeks,
      });
      setGeneratedBrief(brief);
    } catch (err) {
      console.error(err);
    } finally {
      setBriefLoading(false);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    if (selectedClinicId !== 'all' && item.clinicId !== selectedClinicId) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (filterCriticalOnly && !item.criticalForWinter && item.quantity >= item.minThreshold) return false;
    return true;
  });

  const lowStockItems = inventory.filter((i) => i.quantity < i.minThreshold);
  const winterCriticalItems = inventory.filter((i) => i.criticalForWinter);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Top Section: Quick Summary Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-stone-900 border border-amber-900/40 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
              Field Command &amp; Logistics
            </span>
            <span className="text-stone-400 text-xs">• Winter Pass Status: <strong className="text-emerald-400">Open until Nov 20</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Himalayan Clinic Network &amp; Supply Depot
          </h1>
          <p className="text-sm text-stone-300 max-w-2xl mt-1">
            Real-time telemetry, medical stockpile tracking, and volunteer deployment pathways across Upper Mustang and remote high-altitude monasteries.
          </p>
        </div>

        {/* Quick Stats Counter */}
        <div className="flex items-center gap-4 bg-stone-950/70 p-3.5 rounded-xl border border-stone-800">
          <div className="text-center px-3 border-r border-stone-800">
            <div className="text-2xl font-bold text-amber-400 font-cinzel">{CLINIC_SITES.length}</div>
            <div className="text-[11px] text-stone-400">Active Posts</div>
          </div>
          <div className="text-center px-3 border-r border-stone-800">
            <div className="text-2xl font-bold text-rose-400 font-cinzel">{lowStockItems.length}</div>
            <div className="text-[11px] text-stone-400">Restock Alerts</div>
          </div>
          <div className="text-center px-3">
            <div className="text-2xl font-bold text-emerald-400 font-cinzel">
              {CLINIC_SITES.reduce((sum, c) => sum + c.populationServed, 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-stone-400">Villagers Covered</div>
          </div>
        </div>
      </div>

      {/* Section 1: Clinic Sites Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-cinzel text-amber-200 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            HGO Remote Healthcare Facilities
          </h2>
          <span className="text-xs text-stone-400">
            Coordinated with District Health Office &amp; Local Amchis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLINIC_SITES.map((clinic) => {
            const isRestock = clinic.status === 'restock_urgently';
            return (
              <div
                key={clinic.id}
                className={`bg-stone-900/80 rounded-2xl border p-4 flex flex-col justify-between transition-all hover:border-amber-500/60 shadow-lg ${
                  isRestock ? 'border-rose-900/60 ring-1 ring-rose-500/30' : 'border-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-mono">
                      {clinic.altitudeMeters}m
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        clinic.status === 'operational'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : clinic.status === 'restock_urgently'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {clinic.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-stone-100 leading-snug">
                    {clinic.name}
                  </h3>
                  <div className="font-tibetan text-amber-300/80 text-xs mb-2">
                    {clinic.nameTibetan}
                  </div>

                  <p className="text-xs text-stone-400 mb-3 line-clamp-3">
                    {clinic.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-stone-800/80 text-[11px] text-stone-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{clinic.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Pop. Served: <strong>{clinic.populationServed}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{clinic.contactChannel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="text-stone-400">{clinic.distanceFromJomsom}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-800/50">
                    <span className="font-mono text-[10px] text-stone-400">GPS: {clinic.coordinates}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${clinic.name} ${clinic.location} Nepal`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                      title="View on Google Maps"
                    >
                      <span>Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedClinicId(clinic.id);
                      const el = document.getElementById('inventory-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors text-center"
                  >
                    View Supplies ({inventory.filter(i => i.clinicId === clinic.id).length})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Supply Inventory Matrix */}
      <div id="inventory-section" className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-cinzel text-amber-200 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              Medical &amp; Emergency Supply Inventory
            </h2>
            <p className="text-xs text-stone-400">
              Track pharmaceuticals, surgical kits, altitude oxygen, and Sowa-Rigpa medicines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/40 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supply Item</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-stone-800">
          <div className="flex items-center gap-1 text-xs text-stone-400">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>Clinic:</span>
          </div>
          <select
            value={selectedClinicId}
            onChange={(e) => setSelectedClinicId(e.target.value)}
            className="bg-stone-800 border border-stone-700 text-xs rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Clinics ({inventory.length})</option>
            {CLINIC_SITES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 text-xs text-stone-400 ml-2">
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-800 border border-stone-700 text-xs rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            <option value="antibiotic">Antibiotics</option>
            <option value="dental">Dental Supplies</option>
            <option value="altitude_emergency">Altitude &amp; Emergency O₂</option>
            <option value="sowa_rigpa">Sowa-Rigpa (Sorig)</option>
            <option value="analgesic">Analgesic / Pain</option>
            <option value="surgical">Surgical / Sutures</option>
            <option value="ophthalmic">Ophthalmic / Eyes</option>
          </select>

          <button
            onClick={() => setFilterCriticalOnly(!filterCriticalOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ml-auto ${
              filterCriticalOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Show Low Stock / Winter Critical</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Supply Item</th>
                <th className="py-3 px-3">Clinic Facility</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Current Stock</th>
                <th className="py-3 px-3">Min Buffer</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Expiry</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 bg-stone-900/40">
              {filteredInventory.map((item) => {
                const clinic = CLINIC_SITES.find((c) => c.id === item.clinicId);
                const isBelowMin = item.quantity < item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-100">
                      <div>{item.name}</div>
                      {item.notes && <div className="text-[10px] text-stone-400">{item.notes}</div>}
                    </td>
                    <td className="py-3 px-3 text-stone-300">
                      <span className="font-semibold text-amber-300">{clinic?.name.split(' ')[0]}</span>
                      <div className="text-[10px] text-stone-500">{clinic?.altitudeMeters}m</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300 capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      <span className={isBelowMin ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                        {item.quantity}
                      </span>{' '}
                      <span className="text-[10px] text-stone-500">{item.unit}</span>
                    </td>
                    <td className="py-3 px-3 text-stone-400">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="py-3 px-3">
                      {isBelowMin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Restock Req
                        </span>
                      ) : item.criticalForWinter ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px]">
                          <Snowflake className="w-2.5 h-2.5" />
                          Winter Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Adequate
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-stone-400 font-mono text-[11px]">
                      {item.expiryDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 bg-stone-800 p-1 rounded-lg border border-stone-700">
                        <button
                          onClick={() => handleQuantityAdjust(item.id, -1)}
                          className="p-1 rounded hover:bg-stone-700 text-stone-300 hover:text-white"
                          title="Decrease 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-amber-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityAdjust(item.id, 1)}
                          className="p-1 rounded hover:bg-stone-700 text-stone-300 hover:text-white"
                          title="Increase 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Volunteer Onboarding & Acclimatization Generator */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-cinzel text-amber-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Automated Volunteer Onboarding &amp; Acclimatization Studio
            </h2>
            <p className="text-xs text-stone-400">
              Generates travel routes from Kathmandu to Upper Mustang, acclimatization checkpoints, gear checklist, and cultural guidelines for international medical teams.
            </p>
          </div>

          <button
            onClick={handleGenerateBrief}
            disabled={briefLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-md shadow-amber-900/40"
          >
            {briefLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Expedition Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Volunteer Brief</span>
              </>
            )}
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Volunteer Medical Specialty
            </label>
            <select
              value={volunteerSpecialty}
              onChange={(e) => setVolunteerSpecialty(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Dentist (General & Oral Surgery)">Dentist (General &amp; Oral Surgery)</option>
              <option value="Ophthalmologist / Optometrist">Ophthalmologist / Optometrist</option>
              <option value="General Physician / Emergency">General Physician / Emergency</option>
              <option value="Pediatrician & Child Health">Pediatrician &amp; Child Health</option>
              <option value="Field Nurse / Triage Specialist">Field Nurse / Triage Specialist</option>
              <option value="Expedition Logistician / Porter Coordinator">Expedition Logistician</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Expedition Window / Month
            </label>
            <select
              value={travelMonth}
              onChange={(e) => setTravelMonth(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="October (Autumn Expedition - Clear skies, freezing nights)">October (Autumn Expedition)</option>
              <option value="April (Spring Expedition - Moderate winds, pass opening)">April (Spring Expedition)</option>
              <option value="May (Tiji Festival Medical Support)">May (Tiji Festival Medical Support)</option>
              <option value="September (Post-monsoon green valleys)">September (Post-monsoon)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Field Duration
            </label>
            <select
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="2 weeks (Standard Medical Mission)">2 weeks (Standard Mission)</option>
              <option value="3 weeks (Extended Upper Mustang & Dolpo)">3 weeks (Extended Expedition)</option>
              <option value="1 month (Monastery Residency & Sowa-Rigpa Research)">1 month (Residency)</option>
            </select>
          </div>
        </div>

        {/* Output Area or Default Checklist */}
        {generatedBrief ? (
          <div className="bg-stone-950 p-5 rounded-xl border border-stone-700/80 relative">
            <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Tailored Field Orientation Plan
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Orientation Brief</span>
              </button>
            </div>
            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none whitespace-pre-wrap">
              {generatedBrief}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Standard High-Altitude Medical Gear Matrix (3,500m - 3,900m)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {VOLUNTEER_GEAR_CHECKLIST.map((item, idx) => (
                <div key={idx} className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-amber-300 font-medium">
                      {item.category}
                    </span>
                    {item.required && (
                      <span className="text-[10px] text-rose-400 font-semibold">Mandatory</span>
                    )}
                  </div>
                  <div className="font-semibold text-stone-200">{item.item}</div>
                  <p className="text-[11px] text-stone-400">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Supply Item */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold font-cinzel text-amber-200">
              Add Field Supply to Stockpile
            </h3>
            <form onSubmit={handleAddNewItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Lidocaine 2% or Sutures 3-0"
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Clinic</label>
                  <select
                    value={newItemClinic}
                    onChange={(e) => setNewItemClinic(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-100"
                  >
                    {CLINIC_SITES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.split(' ')[0]} ({c.altitudeMeters}m)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-100"
                  >
                    <option value="antibiotic">Antibiotic</option>
                    <option value="dental">Dental</option>
                    <option value="altitude_emergency">Altitude O2 / Emergency</option>
                    <option value="sowa_rigpa">Sowa-Rigpa</option>
                    <option value="analgesic">Analgesic</option>
                    <option value="surgical">Surgical</option>
                    <option value="ophthalmic">Ophthalmic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Min Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={newItemMin}
                    onChange={(e) => setNewItemMin(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="winterCheck"
                  checked={newItemWinter}
                  onChange={(e) => setNewItemWinter(e.target.checked)}
                  className="rounded bg-stone-800 border-stone-700 text-amber-600 focus:ring-0"
                />
                <label htmlFor="winterCheck" className="text-stone-300">
                  Critical stockpile required before winter pass closure
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-md shadow-amber-900/40"
                >
                  Add to Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
