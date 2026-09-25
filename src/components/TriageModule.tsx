import React, { useState } from 'react';
import { 
  TriageRecord, 
  LakeLouiseEvaluation 
} from '../types/index.ts';
import { CLINIC_SITES } from '../data/hgoData.ts';
import { 
  saveTriageRecord, 
  syncAllTriageRecords 
} from '../services/storage.ts';
import { triagePatientAI } from '../services/api.ts';
import { 
  Stethoscope, 
  AlertOctagon, 
  CheckCircle, 
  AlertTriangle, 
  Printer, 
  UploadCloud, 
  WifiOff, 
  Sparkles, 
  Activity, 
  Heart, 
  Compass, 
  Send
} from 'lucide-react';

interface TriageModuleProps {
  records: TriageRecord[];
  setRecords: (records: TriageRecord[]) => void;
  lowBandwidthMode: boolean;
}

export const TriageModule: React.FC<TriageModuleProps> = ({
  records,
  setRecords,
  lowBandwidthMode,
}) => {
  // Intake Form State
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [village, setVillage] = useState('Tsarang (3,560m)');
  const [clinicSiteId, setClinicSiteId] = useState('tsarang');
  const [chiefComplaint, setChiefComplaint] = useState('');

  // Lake Louise AMS inputs (0 to 3)
  const [lakeLouise, setLakeLouise] = useState<LakeLouiseEvaluation>({
    headache: 1,
    gastrointestinal: 0,
    fatigueWeakness: 1,
    dizzinessLightheadedness: 0,
    functionalImpairment: 0,
  });

  // Vitals
  const [spo2, setSpo2] = useState<number>(88);
  const [heartRate, setHeartRate] = useState<number>(85);
  const [bpSystolic, setBpSystolic] = useState<number>(124);
  const [bpDiastolic, setBpDiastolic] = useState<number>(80);
  const [tempCelsius, setTempCelsius] = useState<number>(37.0);

  // Evaluation & Processing State
  const [loading, setLoading] = useState(false);
  const [activeRecord, setActiveRecord] = useState<TriageRecord | null>(records[0] || null);

  const calculateTotalScore = (evalObj: LakeLouiseEvaluation) => {
    return (
      evalObj.headache +
      evalObj.gastrointestinal +
      evalObj.fatigueWeakness +
      evalObj.dizzinessLightheadedness +
      evalObj.functionalImpairment
    );
  };

  const currentScore = calculateTotalScore(lakeLouise);

  // Compute category
  const determineCategory = (score: number, o2: number): 'GREEN' | 'YELLOW' | 'RED' => {
    if (score >= 6 || o2 < 75 || lakeLouise.functionalImpairment === 3) return 'RED';
    if (score >= 3 || o2 < 85) return 'YELLOW';
    return 'GREEN';
  };

  const currentCategory = determineCategory(currentScore, spo2);

  const handleRunEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    setLoading(true);
    const selectedClinic = CLINIC_SITES.find((c) => c.id === clinicSiteId);
    const altitude = selectedClinic ? selectedClinic.altitudeMeters : 3500;

    const payload = {
      symptoms: [
        `Chief complaint: ${chiefComplaint}`,
        `Headache: ${lakeLouise.headache}/3`,
        `GI symptoms: ${lakeLouise.gastrointestinal}/3`,
        `Fatigue: ${lakeLouise.fatigueWeakness}/3`,
        `Dizziness: ${lakeLouise.dizzinessLightheadedness}/3`,
        `Functional impairment: ${lakeLouise.functionalImpairment}/3`,
      ],
      vitals: { spo2, heartRate, bp: `${bpSystolic}/${bpDiastolic}`, tempCelsius },
      altitudeMeters: altitude,
      lakeLouiseScore: currentScore,
      notes: `Patient from ${village}`,
    };

    let aiAssessment = '';
    try {
      aiAssessment = await triagePatientAI(payload);
    } catch (err) {
      console.warn('AI Triage request fallback used:', err);
    }

    const newRecord: TriageRecord = {
      id: `TR-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      patientName: patientName.trim(),
      age,
      gender,
      village,
      clinicSiteId,
      altitudeMeters: altitude,
      chiefComplaint: chiefComplaint.trim() || 'High altitude health consultation',
      lakeLouise,
      totalAMSScore: currentScore,
      vitals: {
        spo2,
        heartRate,
        bpSystolic,
        bpDiastolic,
        tempCelsius,
      },
      triageCategory: currentCategory,
      allopathicRecommendations:
        currentCategory === 'RED'
          ? 'Emergency Descent Required (<2,800m). High-Flow O2 (4-6L). Dexamethasone 8mg PO/IM stat.'
          : currentCategory === 'YELLOW'
          ? 'Halt ascent. Bed rest. Hydration 3-4L warm fluid. Acetazolamide 125-250mg BID + Paracetamol 500mg.'
          : 'Continue acclimatization routine. Routine symptomatic relief and warm dress.',
      sowaRigpaDiagnosis:
        currentCategory === 'RED'
          ? 'Severe violent rising of Life-Bearing Wind (Srog-rLung) with cold lung stagnation.'
          : 'rLung agitation provoked by freezing dry mountain winds and dry mucosal passages.',
      sowaRigpaHerbalSuggestions:
        currentCategory === 'RED'
          ? ['Agar-35 (crushed)', 'Warm sesame oil crown massage during immediate descent']
          : ['Agar-35', 'Semde', 'Boiled warm garlic soup (sgog-thug)'],
      nepaliInstructions:
        currentCategory === 'RED'
          ? 'गम्भीर लेक लागेको आपतकालीन अवस्था! तुरुन्त अक्सिजन लगाउनुहोस् र बिरामीलाई तुरुन्त तल झार्नुहोस्।'
          : 'बिरामीलाई आराम गराउनुहोस् र प्रशस्त तातो पानी पिउन दिनुहोस्। चिसोबाट जोगाउनुहोस्।',
      tibetanInstructions:
        currentCategory === 'RED'
          ? 'ལ་དུག་དྲག་པོ་ཕོག་འདུག མྱུར་དུ་དབུགས་རླུང་ (Oxygen) སྦྱིན་ནས་མར་ཇོ་མོ་སོ་མོ་ཕྱོགས་སུ་མར་བབས་དགོས།'
          : 'ཆུ་ཚན་མང་པོ་འཐུང་དགོས། ལྷགས་པ་དང་གྲང་ངར་ལ་འཛེམ་དགོས། སྨན་འདི་ཉིན་ལྟར་ཟོས།',
      synced: !lowBandwidthMode,
      evacuationRequested: currentCategory === 'RED',
    };

    const updated = saveTriageRecord(newRecord);
    setRecords(updated);
    setActiveRecord(newRecord);
    setLoading(false);

    // Reset basic fields
    setPatientName('');
    setChiefComplaint('');
  };

  const handleSyncAll = () => {
    const { updated, syncedCount } = syncAllTriageRecords();
    setRecords(updated);
  };

  const unsyncedRecords = records.filter((r) => !r.synced);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider">
              High-Altitude Emergency Triage
            </span>
            <span className="text-stone-400 text-xs">
              Lake Louise Score (AMS) &amp; Sowa-Rigpa Integrative Intake
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Low-Bandwidth Field Triage Station
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Standardized altitude sickness scoring and integrative diagnostics designed to operate completely offline in remote Himalayan valleys.
          </p>
        </div>

        {/* Sync Status Banner */}
        <div className="flex items-center gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800">
          <div className="text-right">
            <div className="text-xs font-semibold text-stone-300">
              {unsyncedRecords.length === 0 ? (
                <span className="text-emerald-400 flex items-center gap-1 justify-end">
                  <CheckCircle className="w-3.5 h-3.5" /> All Synced
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1 justify-end">
                  <WifiOff className="w-3.5 h-3.5" /> {unsyncedRecords.length} Stored Locally
                </span>
              )}
            </div>
            <div className="text-[10px] text-stone-400">Offline Caching Active</div>
          </div>
          {unsyncedRecords.length > 0 && (
            <button
              onClick={handleSyncAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Sync Cloud</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Triage Intake Form (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold font-cinzel text-amber-200 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-amber-400" />
            Patient Intake &amp; AMS Evaluation
          </h2>

          <form onSubmit={handleRunEvaluation} className="space-y-5 text-xs">
            {/* Row 1: Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-stone-300 font-semibold mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Dolma Lhamo"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Age</label>
                <input
                  type="number"
                  min={1}
                  max={105}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Row 2: Location & Clinic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Village / Origin</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Tsarang, Ghemi, Lo Manthang"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Triage Post</label>
                <select
                  value={clinicSiteId}
                  onChange={(e) => setClinicSiteId(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {CLINIC_SITES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.altitudeMeters}m)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Chief Complaint */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Chief Complaint</label>
              <textarea
                rows={2}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Describe symptoms, duration, acute changes during altitude ascent, dental pain, cough..."
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Row 4: Vital Signs Card */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-stone-300 font-semibold text-xs border-b border-stone-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Key Objective Vitals
                </span>
                <span className="text-[11px] text-stone-500 font-normal">
                  SpO2 &lt;80% at 3,800m is high risk
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={spo2}
                    onChange={(e) => setSpo2(parseInt(e.target.value, 10) || 0)}
                    className={`w-full bg-stone-900 border rounded-lg px-2.5 py-1.5 font-mono font-bold ${
                      spo2 < 75 ? 'border-rose-500 text-rose-400' : spo2 < 85 ? 'border-amber-500 text-amber-300' : 'border-stone-700 text-emerald-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    min={30}
                    max={200}
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 font-mono text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">BP (Systolic)</label>
                  <input
                    type="number"
                    min={50}
                    max={240}
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 font-mono text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={30}
                    max={43}
                    value={tempCelsius}
                    onChange={(e) => setTempCelsius(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 font-mono text-stone-100"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Lake Louise Acute Mountain Sickness Evaluation Matrix */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-semibold text-stone-200 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  Lake Louise AMS Scoring (2018 Consensus)
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-800 font-bold text-amber-300">
                  Current Score: {currentScore} / 15
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {[
                  { key: 'headache', label: '1. Headache', options: ['None (0)', 'Mild (1)', 'Moderate (2)', 'Severe / Incapacitating (3)'] },
                  { key: 'gastrointestinal', label: '2. Gastrointestinal (Nausea / Vomiting)', options: ['Good appetite (0)', 'Poor appetite / nausea (1)', 'Moderate nausea / vomiting (2)', 'Severe nausea & vomiting (3)'] },
                  { key: 'fatigueWeakness', label: '3. Fatigue / Weakness', options: ['Normal energy (0)', 'Mild fatigue (1)', 'Moderate fatigue / weakness (2)', 'Severe fatigue / bedbound (3)'] },
                  { key: 'dizzinessLightheadedness', label: '4. Dizziness / Lightheadedness', options: ['None (0)', 'Mild dizziness (1)', 'Moderate dizziness (2)', 'Severe / room spinning (3)'] },
                  { key: 'functionalImpairment', label: '5. Overall Functional Impairment', options: ['Normal activities (0)', 'Slight reduction (1)', 'Greatly reduced (2)', 'Bedridden / unable to walk (3)'] },
                ].map((item) => (
                  <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-stone-300 font-medium">{item.label}</span>
                    <div className="grid grid-cols-4 gap-1 sm:w-80">
                      {item.options.map((opt, val) => {
                        const isSelected = (lakeLouise as any)[item.key] === val;
                        return (
                          <button
                            type="button"
                            key={val}
                            onClick={() => setLakeLouise((prev) => ({ ...prev, [item.key]: val }))}
                            className={`py-1 px-1.5 text-[10px] rounded text-center transition-all truncate ${
                              isSelected
                                ? val >= 2
                                  ? 'bg-rose-600 text-white font-bold shadow'
                                  : 'bg-amber-600 text-white font-bold shadow'
                                : 'bg-stone-800 hover:bg-stone-700 text-stone-400'
                            }`}
                            title={opt}
                          >
                            {val}: {opt.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant Category Indicator preview */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-medium">Calculated Triage Severity:</span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    currentCategory === 'RED'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : currentCategory === 'YELLOW'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {currentCategory === 'RED' && <AlertOctagon className="w-3.5 h-3.5" />}
                  {currentCategory === 'YELLOW' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {currentCategory === 'GREEN' && <CheckCircle className="w-3.5 h-3.5" />}
                  {currentCategory === 'RED' ? 'RED: Immediate Evac' : currentCategory === 'YELLOW' ? 'YELLOW: Urgent Rest/Meds' : 'GREEN: Routine Care'}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !patientName.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-lg shadow-amber-900/40 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Evaluating...' : 'Save & Generate Protocol'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Active Triage Slip & Recent Records (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeRecord ? (
            <div className="bg-stone-900/90 border border-stone-700/80 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <span className="font-mono text-[10px] text-stone-500">{activeRecord.id}</span>
                  <h3 className="font-bold text-base text-stone-100">{activeRecord.patientName}</h3>
                  <div className="text-[11px] text-stone-400">
                    {activeRecord.age}yo {activeRecord.gender} • {activeRecord.village}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg font-bold text-xs uppercase tracking-wider ${
                      activeRecord.triageCategory === 'RED'
                        ? 'bg-rose-600 text-white shadow-rose-900/40 shadow-lg'
                        : activeRecord.triageCategory === 'YELLOW'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {activeRecord.triageCategory}
                  </span>
                  <div className="text-[10px] text-stone-400 mt-1">AMS: {activeRecord.totalAMSScore}/15</div>
                </div>
              </div>

              {/* Vitals overview */}
              <div className="grid grid-cols-3 gap-2 bg-stone-950 p-2.5 rounded-xl text-center">
                <div>
                  <div className="text-[10px] text-stone-500">SpO2</div>
                  <div className={`font-mono font-bold text-sm ${activeRecord.vitals.spo2 < 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeRecord.vitals.spo2}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">Pulse</div>
                  <div className="font-mono font-bold text-sm text-stone-200">
                    {activeRecord.vitals.heartRate} bpm
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">BP</div>
                  <div className="font-mono font-bold text-sm text-stone-200">
                    {activeRecord.vitals.bpSystolic}/{activeRecord.vitals.bpDiastolic}
                  </div>
                </div>
              </div>

              {/* Allopathic Protocol */}
              <div className="space-y-1">
                <span className="font-semibold text-amber-300 text-[11px] uppercase tracking-wider">
                  Emergency Medical Directive
                </span>
                <p className="text-stone-300 bg-stone-950/70 p-2.5 rounded-xl border border-stone-800 leading-relaxed">
                  {activeRecord.allopathicRecommendations}
                </p>
              </div>

              {/* Sowa-Rigpa Integrative Diagnosis */}
              <div className="space-y-1">
                <span className="font-semibold text-emerald-300 text-[11px] uppercase tracking-wider">
                  Sowa-Rigpa Traditional Evaluation
                </span>
                <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800 space-y-1.5">
                  <p className="text-stone-300">{activeRecord.sowaRigpaDiagnosis}</p>
                  {activeRecord.sowaRigpaHerbalSuggestions && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {activeRecord.sowaRigpaHerbalSuggestions.map((h, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-[10px]">
                          🌿 {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions in Nepali & Tibetan */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Nepali (नेपाली):</span>
                  <p className="text-stone-200 leading-relaxed font-medium">
                    {activeRecord.nepaliInstructions}
                  </p>
                </div>

                <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-300/80 uppercase">Tibetan (བོད་ཡིག):</span>
                  <p className="font-tibetan text-stone-200 text-sm leading-relaxed">
                    {activeRecord.tibetanInstructions}
                  </p>
                </div>
              </div>

              {/* Print Slip Button */}
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors border border-stone-700 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-stone-300" />
                <span>Print Triage Field Slip</span>
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-stone-800 text-center text-stone-500">
              Select or submit a patient record to view clinical guidelines.
            </div>
          )}

          {/* List of Recent Intake Records */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Recent Field Admissions ({records.length})
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {records.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => setActiveRecord(rec)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                    activeRecord?.id === rec.id
                      ? 'bg-stone-800 border-amber-500/80 shadow'
                      : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-stone-200">{rec.patientName}</div>
                    <div className="text-[10px] text-stone-500">
                      {rec.village} • AMS {rec.totalAMSScore}/15
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.triageCategory === 'RED'
                          ? 'bg-rose-500/20 text-rose-300'
                          : rec.triageCategory === 'YELLOW'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {rec.triageCategory}
                    </span>
                    {!rec.synced && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" title="Offline Cached" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
