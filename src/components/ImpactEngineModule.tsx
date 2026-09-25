import React, { useState } from 'react';
import { generateImpactReportAI } from '../services/api.ts';
import { GratitudeCertificate } from '../types/index.ts';
import { DUMMY_CAMP_TEMPLATES, DUMMY_DONOR_PROFILES } from '../data/hgoData.ts';
import { 
  HeartHandshake, 
  Sparkles, 
  FileText, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  Award, 
  DollarSign, 
  Users, 
  Building2, 
  RefreshCw,
  Stamp,
  ExternalLink
} from 'lucide-react';

interface ImpactEngineModuleProps {
  initialSponsorDetails?: {
    monasteryName: string;
    projectTitle: string;
    suggestedAmount: number;
  } | null;
}

export const ImpactEngineModule: React.FC<ImpactEngineModuleProps> = ({
  initialSponsorDetails,
}) => {
  // Raw notes to report state
  const [campLocation, setCampLocation] = useState('Upper Mustang (Tsarang & Tsonup Clinics)');
  const [dates, setDates] = useState('Autumn Expedition 2026');
  const [partner, setPartner] = useState('JJoy Foundation & Rotary International');
  const [patientsServed, setPatientsServed] = useState(337);
  const [dentalProcedures, setDentalProcedures] = useState(142);
  const [cataractScreenings, setCataractScreenings] = useState(89);
  const [rawNotes, setRawNotes] = useState(
    '337 patients served over 4 days in Upper Mustang. 142 dental extractions and fillings by Dr. Sarah Lin and team. 89 cataract and pterygium screenings; 112 UV sunglasses distributed to elderly yak herders. Severe osteoarthritis prevalent. Amchi Karma Tenzin provided complementary Sowa-Rigpa Agar-35 remedies for cold-wind rLung.'
  );

  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Gratitude Certificate State
  const [donorName, setDonorName] = useState('Pema Riczin');
  const [amountUSD, setAmountUSD] = useState<number>(
    initialSponsorDetails?.suggestedAmount || 1500
  );
  const [impactProject, setImpactProject] = useState<string>(
    initialSponsorDetails
      ? `${initialSponsorDetails.monasteryName}: ${initialSponsorDetails.projectTitle}`
      : 'Tsonup Community Clinic High-Altitude Dental Unit'
  );
  const [certificateNumber, setCertificateNumber] = useState(
    `HGO-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );

  const handleLoadCampTemplate = (tpl: typeof DUMMY_CAMP_TEMPLATES[0]) => {
    setCampLocation(tpl.location);
    setDates(tpl.dates);
    setPartner(tpl.partner);
    setPatientsServed(tpl.patientsServed);
    setDentalProcedures(tpl.dentalProcedures);
    setCataractScreenings(tpl.cataractScreenings);
    setRawNotes(tpl.rawNotes);
  };

  const handleLoadDonorProfile = (donor: typeof DUMMY_DONOR_PROFILES[0]) => {
    setDonorName(donor.name);
    setAmountUSD(donor.amount);
    setImpactProject(donor.project);
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const report = await generateImpactReportAI({
        rawNotes,
        campLocation,
        dates,
        metrics: {
          patientsServed,
          dentalProcedures,
          cataractScreenings,
          costPerPatient: (amountUSD / Math.max(1, patientsServed)).toFixed(2),
        },
        partner,
      });
      setGeneratedReport(report);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const copyReportText = () => {
    if (!generatedReport) return;
    navigator.clipboard.writeText(generatedReport);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-stone-900 to-stone-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider">
              Donor Engagement &amp; Impact Studio
            </span>
            <span className="text-stone-400 text-xs">JJoy Foundation • Rotary International • Global Patrons</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white flex items-center gap-2">
            Impact Synthesizer &amp; Gratitude Engine
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Instantly transform raw medical tallies and doctor field notes into structured donor reports, partner briefings, and personalized gratitude certificates.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-stone-950/80 p-3 rounded-xl border border-stone-800 text-xs">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <div className="font-semibold text-stone-200">100% Tax Deductible</div>
            <div className="text-[11px] text-stone-400">Official Himalayan Guge Org Seals</div>
          </div>
        </div>
      </div>

      {/* Section 1: Raw Field Notes to Multi-Channel Deliverables */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-cinzel text-amber-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Automated Field Report Generator
            </h2>
            <p className="text-xs text-stone-400">
              Converts rough numbers from remote clinics into 3 publication-ready assets: Executive Donor Brief, Rotary/JJoy Grant Summary, and Social Media Story.
            </p>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-lg shadow-amber-900/40"
          >
            {generatingReport ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Field Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Multi-Channel Report</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Dummy Camp Template Selector */}
        <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick-Load Real-World Camp Scenario (Dummy Data):
            </span>
            <span className="text-[10px] text-stone-500">Click to populate tallies &amp; notes</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DUMMY_CAMP_TEMPLATES.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadCampTemplate(tpl)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-stone-900 hover:bg-amber-950/80 text-stone-300 hover:text-amber-200 border border-stone-800 hover:border-amber-600/50 transition-all text-left"
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">Camp Location</label>
            <input
              type="text"
              value={campLocation}
              onChange={(e) => setCampLocation(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Expedition Dates</label>
            <input
              type="text"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Grant / Partner Organization</label>
            <input
              type="text"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
            />
          </div>
        </div>

        {/* Numeric tallies */}
        <div className="grid grid-cols-3 gap-3 text-xs bg-stone-950 p-4 rounded-xl border border-stone-800">
          <div>
            <label className="block text-stone-400 font-medium mb-1">Patients Served</label>
            <input
              type="number"
              value={patientsServed}
              onChange={(e) => setPatientsServed(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 font-mono font-bold text-amber-300"
            />
          </div>
          <div>
            <label className="block text-stone-400 font-medium mb-1">Dental Extractions/Fillings</label>
            <input
              type="number"
              value={dentalProcedures}
              onChange={(e) => setDentalProcedures(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 font-mono font-bold text-sky-300"
            />
          </div>
          <div>
            <label className="block text-stone-400 font-medium mb-1">Cataract / Eye Screenings</label>
            <input
              type="number"
              value={cataractScreenings}
              onChange={(e) => setCataractScreenings(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 font-mono font-bold text-emerald-300"
            />
          </div>
        </div>

        {/* Raw text input */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-stone-300 font-semibold">
            Raw Doctor Field Notes &amp; Community Observations:
          </label>
          <textarea
            rows={3}
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-stone-100 font-sans leading-relaxed focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Output Area */}
        {generatedReport && (
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-700 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Publication-Ready Impact Deliverables
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyReportText}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors"
                >
                  {copiedReport ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All Formats</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Formal Report</span>
                </button>
              </div>
            </div>

            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none whitespace-pre-wrap">
              {generatedReport}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Personalized Gratitude Voucher & Tax Certificate Generator */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-cinzel text-amber-200 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Personalized Donor Gratitude &amp; Impact Receipt
            </h2>
            <p className="text-xs text-stone-400">
              Generates an official HGO Certificate of Merit with Tibetan seals, blessing mantra, and specific clinic allocation.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-900/30 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Certificate</span>
          </button>
        </div>

        {/* Quick Dummy Donor Selector */}
        <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Quick-Load Sample Benefactor Profile (Dummy Data):
            </span>
            <span className="text-[10px] text-stone-500">Click to preview custom certificate</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DUMMY_DONOR_PROFILES.map((donor, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadDonorProfile(donor)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-stone-900 hover:bg-amber-950/80 text-stone-300 hover:text-amber-200 border border-stone-800 hover:border-amber-600/50 transition-all text-left"
              >
                {donor.name.split(' ')[0]} &bull; ${donor.amount.toLocaleString()} ({donor.project.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Inputs for Certificate */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">Donor or Organization Name</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Contribution Amount (USD)</label>
            <input
              type="number"
              min={10}
              step={50}
              value={amountUSD}
              onChange={(e) => setAmountUSD(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Sponsored Facility / Project</label>
            <input
              type="text"
              value={impactProject}
              onChange={(e) => setImpactProject(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
            />
          </div>
        </div>

        {/* High-Fidelity Printable Certificate Preview */}
        <div className="relative bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50 text-stone-900 p-8 sm:p-12 rounded-2xl border-4 border-amber-800/80 shadow-2xl overflow-hidden font-serif">
          {/* Subtle Tibetan Auspicious Border Ornament */}
          <div className="absolute inset-2 border-2 border-dashed border-amber-700/40 pointer-events-none" />

          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="font-tibetan text-9xl font-bold">ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།</span>
          </div>

          {/* Certificate Content */}
          <div className="relative z-10 text-center space-y-4">
            <div className="font-tibetan text-amber-900 text-lg sm:text-xl font-bold tracking-widest">
              ཧི་མ་ལ་ཡའི་གུ་གེ་ཚོགས་པ།
            </div>
            <div className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-widest text-amber-950">
              Himalayan Guge Organization (HGO)
            </div>
            <p className="text-[11px] text-stone-600 uppercase tracking-widest font-sans font-semibold">
              KATHMANDU • LO MANTHANG • DOLAKHA • REGISTERED HIMALAYAN NGO
            </p>

            <div className="my-4 border-b border-amber-800/30 w-32 mx-auto" />

            <div className="font-cinzel text-sm sm:text-base font-bold text-amber-900 uppercase tracking-widest">
              Certificate of Humanitarian Benefaction
            </div>

            <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto italic font-serif">
              In deep honor and heartfelt appreciation for the generous contribution of
            </p>

            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-950 py-1 border-b-2 border-amber-800/40 inline-block px-8">
              {donorName || 'Valued Humanitarian Partner'}
            </div>

            <p className="text-xs sm:text-sm text-stone-800 max-w-xl mx-auto leading-relaxed">
              Who has graciously gifted <strong className="font-sans font-bold text-amber-900">${amountUSD.toLocaleString()} USD</strong> towards the vital preservation and healthcare mission:
            </p>

            <div className="font-semibold text-base sm:text-lg text-amber-900 italic">
              &ldquo;{impactProject}&rdquo;
            </div>

            <p className="text-xs text-stone-600 max-w-lg mx-auto">
              Your compassion provides surgical instruments, emergency oxygen, warm winter shelter, and preserves venerable Sowa-Rigpa heritage for generations to come.
            </p>

            {/* Bottom Signatures & Seal */}
            <div className="pt-8 mt-6 border-t border-amber-800/20 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
              <div className="text-center sm:text-left">
                <div className="font-mono text-[11px] text-stone-500">Certificate No:</div>
                <div className="font-mono font-bold text-xs text-stone-800">{certificateNumber}</div>
                <div className="text-[10px] text-stone-500 font-sans mt-0.5">Date: {new Date().toLocaleDateString()}</div>
              </div>

              {/* Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-red-700 flex flex-col items-center justify-center text-red-700 shadow-inner bg-red-50/50">
                  <Stamp className="w-6 h-6 text-red-700" />
                  <span className="text-[8px] font-sans font-bold tracking-tighter uppercase mt-0.5">HGO SEAL</span>
                </div>
                <span className="font-tibetan text-xs text-red-800 mt-1">བཀྲ་ཤིས་བདེ་ལེགས།</span>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-cinzel font-bold text-xs text-stone-800">
                  Lama Tenzin &amp; Dr. Pema Riczin
                </div>
                <div className="text-[10px] text-stone-600 font-sans">
                  Field Operations &amp; Heritage Directors
                </div>
                <div className="text-[10px] text-amber-900 font-semibold font-sans mt-0.5">
                  Himalayan Guge Organization
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
