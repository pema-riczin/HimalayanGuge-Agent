import React, { useState } from 'react';
import { SOWA_RIGPA_HERBS, QUICK_TRANSLATIONS } from '../data/hgoData.ts';
import { SowaRigpaRemedy, HumoralType } from '../types/index.ts';
import { translateMedicalFieldAI } from '../services/api.ts';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Languages, 
  Volume2, 
  Copy, 
  Check, 
  RefreshCw, 
  Info, 
  Flame, 
  Wind, 
  Droplets,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const CulturalCodexModule: React.FC = () => {
  const [selectedHumor, setSelectedHumor] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHerb, setSelectedHerb] = useState<SowaRigpaRemedy>(SOWA_RIGPA_HERBS[0]);

  // Translation State
  const [customText, setCustomText] = useState('Take 2 tablets in the evening with warm boiled water. Do not eat cold raw foods.');
  const [translationCategory, setTranslationCategory] = useState('medical_instruction');
  const [translating, setTranslating] = useState(false);
  const [translatedResult, setTranslatedResult] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredHerbs = SOWA_RIGPA_HERBS.filter((herb) => {
    if (selectedHumor !== 'all' && !herb.primaryHumor.includes(selectedHumor)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        herb.nameEnglish.toLowerCase().includes(q) ||
        herb.nameWylie.toLowerCase().includes(q) ||
        herb.nameTibetan.includes(q) ||
        herb.primaryIndication.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTranslateCustom = async () => {
    if (!customText.trim()) return;
    setTranslating(true);
    try {
      const result = await translateMedicalFieldAI({
        text: customText,
        category: translationCategory,
      });
      setTranslatedResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setTranslating(false);
    }
  };

  const copyPhrase = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-stone-900 to-stone-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
              Traditional Himalayan Medicine (Sorig)
            </span>
            <span className="text-stone-400 text-xs">Four Tantras (rGyud-bZhi) &amp; Tri-Lingual Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white flex items-center gap-2">
            <span>Sowa-Rigpa Cultural Codex &amp; Translator</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Digitized compendium of Himalayan pharmacology, humoral diagnostics, and instant medical translation across English, Nepali, and Tibetan.
          </p>
        </div>

        <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 text-xs flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-stone-200">Tri-Lingual Dialect Hub</div>
            <div className="text-[11px] text-stone-400">English • नेपाली • བོད་ཡིག (Mustang Dialect)</div>
          </div>
        </div>
      </div>

      {/* Humoral Theory Quick Explainer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-stone-900/80 border border-sky-900/40 rounded-2xl p-4 shadow-md flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-950 text-sky-400 border border-sky-800/40">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sky-300 text-sm">rLung (རླུང་ • Wind)</h3>
              <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 rounded">Prana</span>
            </div>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Mobile, cool, subtle. Aggravated by high-altitude freezing wind, psychological stress, and sleeplessness.
            </p>
            <div className="text-[11px] text-amber-300/90 mt-2 font-medium">
              Key Remedy: <strong>Agar-35, Semde, sesame oil massage</strong>
            </div>
          </div>
        </div>

        <div className="bg-stone-900/80 border border-amber-900/40 rounded-2xl p-4 shadow-md flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/40">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-amber-300 text-sm">mKhris-pa (མཁྲིས་པ • Bile)</h3>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 rounded">Pitta / Heat</span>
            </div>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Hot, sharp, oily. Controls metabolic fire (Me-drod) and hepatic health. Aggravated by intense sunlight and fatty meats.
            </p>
            <div className="text-[11px] text-amber-300/90 mt-2 font-medium">
              Key Remedy: <strong>Tshel-mar-25, Gurkum-13 (Saffron)</strong>
            </div>
          </div>
        </div>

        <div className="bg-stone-900/80 border border-emerald-900/40 rounded-2xl p-4 shadow-md flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-emerald-300 text-sm">Bad-kan (བད་ཀན • Phlegm)</h3>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 rounded">Kapha / Water</span>
            </div>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Cold, heavy, unctuous. Lubricates joints. Aggravated by damp stone floor dwellings and sluggish digestion.
            </p>
            <div className="text-[11px] text-amber-300/90 mt-2 font-medium">
              Key Remedy: <strong>Yungwa-4 (Turmeric), Zhidche-11</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Herb Codex (Left) + Detail View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Search & Herb List (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-cinzel text-amber-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Sorig Formula Repository
            </h2>
            <span className="text-xs text-stone-400 font-mono">
              {filteredHerbs.length} formulations
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, symptom, or Wylie..."
              className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Humor Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {['all', 'rLung', 'mKhris-pa', 'Bad-kan'].map((humor) => (
              <button
                key={humor}
                onClick={() => setSelectedHumor(humor)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                  selectedHumor === humor
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-400'
                }`}
              >
                {humor === 'all' ? 'All Humors' : humor}
              </button>
            ))}
          </div>

          {/* Herb List */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredHerbs.map((herb) => {
              const isSelected = selectedHerb.id === herb.id;
              return (
                <button
                  key={herb.id}
                  onClick={() => setSelectedHerb(herb)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-800 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                      : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="font-bold text-stone-100 text-sm">{herb.nameEnglish}</h4>
                      <div className="font-tibetan text-amber-300/90 text-xs">
                        {herb.nameTibetan} <span className="font-sans text-stone-500 font-mono text-[10px]">({herb.nameWylie})</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-stone-800 text-amber-300 whitespace-nowrap">
                      {herb.primaryHumor.split(' ')[0]}
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                    {herb.primaryIndication}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Herb Deep Codex Details (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedHerb.primaryHumor} Balance
                </span>
                <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
                  {selectedHerb.nameEnglish}
                </h2>
                <div className="font-tibetan text-lg text-amber-300">
                  {selectedHerb.nameTibetan} • <span className="font-sans font-mono text-xs text-stone-400">{selectedHerb.nameWylie}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-800 text-stone-200">
                  Thermal: {selectedHerb.thermalNature}
                </span>
                <div className="text-[11px] text-stone-400 mt-1">
                  Taste: {selectedHerb.dominantTastes.join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Indication & Preparation */}
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-1.5 text-amber-400">
                Primary Clinical Indication
              </h4>
              <p className="text-stone-300 bg-stone-950 p-3.5 rounded-xl border border-stone-800 leading-relaxed text-sm">
                {selectedHerb.primaryIndication}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-1.5 text-stone-400">
                  Traditional Ingredients &amp; Recipe
                </h4>
                <div className="text-stone-300 bg-stone-950 p-3 rounded-xl border border-stone-800 leading-relaxed text-xs">
                  {selectedHerb.traditionalPreparation}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] mb-1.5 text-stone-400">
                  Field Dosage Instructions
                </h4>
                <div className="text-stone-300 bg-stone-950 p-3 rounded-xl border border-stone-800 leading-relaxed text-xs">
                  {selectedHerb.dosageGuidelines}
                </div>
              </div>
            </div>

            {/* High Altitude Context */}
            <div className="bg-amber-950/30 border border-amber-900/50 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                <Info className="w-4 h-4 text-amber-400" />
                <span>High-Altitude Application in Upper Mustang &amp; Monasteries</span>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed">
                {selectedHerb.highAltitudeContext}
              </p>
            </div>

            {/* Contraindications */}
            <div className="text-stone-400 text-xs">
              <strong className="text-rose-400">Contraindications &amp; Precautions:</strong> {selectedHerb.contraindications}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Multilingual Translation Studio */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-cinzel text-amber-200 flex items-center gap-2">
              <Languages className="w-5 h-5 text-amber-400" />
              Himalayan Tri-Lingual Medical Translation Engine
            </h2>
            <p className="text-xs text-stone-400">
              Adapts medical discharge instructions, dental post-op advice, and clinic signage into English, colloquial Nepali, and Tibetan with phonetic pronunciation.
            </p>
          </div>

          <button
            onClick={handleTranslateCustom}
            disabled={translating || !customText.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-md shadow-amber-900/40"
          >
            {translating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Translating into Dialects...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Translate to 3 Dialects</span>
              </>
            )}
          </button>
        </div>

        {/* Input box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-300">
            <span className="font-semibold">Text or Clinic Notice to Translate:</span>
            <div className="flex items-center gap-2">
              <span>Domain:</span>
              <select
                value={translationCategory}
                onChange={(e) => setTranslationCategory(e.target.value)}
                className="bg-stone-800 border border-stone-700 text-xs rounded-lg px-2 py-1 text-stone-200"
              >
                <option value="medical_instruction">Patient Medical Instruction</option>
                <option value="dental_post_care">Dental Extraction Post-Care</option>
                <option value="altitude_safety">Altitude Safety Warning</option>
                <option value="monastery_etiquette">Monastery & Cultural Etiquette</option>
              </select>
            </div>
          </div>
          <textarea
            rows={3}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-sans"
            placeholder="Type or paste medical or clinic text here..."
          />
        </div>

        {/* Generated Translation Result */}
        {translatedResult && (
          <div className="bg-stone-950 p-5 rounded-xl border border-stone-700 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Tri-Lingual Translation &amp; Pronunciation Guide
              </span>
              <button
                onClick={() => copyPhrase('result', translatedResult)}
                className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200"
              >
                {copiedKey === 'result' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Full Text</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none whitespace-pre-wrap">
              {translatedResult}
            </div>
          </div>
        )}

        {/* Section 3: Essential Field Phrase Cards */}
        <div className="space-y-3 pt-3 border-t border-stone-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Rapid Field Clinical Signage Cards (Quick Copy)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {QUICK_TRANSLATIONS.map((qt, idx) => (
              <div
                key={idx}
                className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 text-xs space-y-2 hover:border-stone-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-100">{qt.english}</span>
                  <button
                    onClick={() => copyPhrase(`qt-${idx}`, `${qt.english}\nNepali: ${qt.nepali}\nTibetan: ${qt.tibetan}\nPhonetic: ${qt.phonetic}`)}
                    className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200"
                    title="Copy translation bundle"
                  >
                    {copiedKey === `qt-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="space-y-1 pt-1 border-t border-stone-800/80">
                  <div className="text-stone-300">
                    <span className="text-stone-500 font-medium">नेपाली:</span> {qt.nepali}
                  </div>
                  <div className="font-tibetan text-amber-300 text-sm">
                    {qt.tibetan}
                  </div>
                  <div className="text-[11px] text-stone-400 italic">
                    Pronunciation: &ldquo;{qt.phonetic}&rdquo;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
