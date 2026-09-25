import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Copy, 
  Check, 
  Compass, 
  BookOpen, 
  HeartHandshake, 
  ShieldAlert, 
  Cpu, 
  ArrowRight,
  Stethoscope,
  MapPin,
  Navigation
} from 'lucide-react';
import { AgentRole, ChatMessage } from '../types/index.ts';
import { askAgent } from '../services/api.ts';

interface AgentConsoleProps {
  onNavigateToTab: (tabId: string) => void;
  lowBandwidthMode: boolean;
}

export const AgentConsole: React.FC<AgentConsoleProps> = ({
  onNavigateToTab,
  lowBandwidthMode,
}) => {
  const [role, setRole] = useState<AgentRole>('general');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [useMapsGrounding, setUseMapsGrounding] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      role: 'general',
      text: `### 🏔️ Tashi Delek! Welcome to HGO-Agent.
I am the digital co-pilot for the **Himalayan Guge Organization (HGO)**, bridging remote Himalayan field teams, traditional Sowa-Rigpa knowledge keepers, and our international partner network (JJoy Foundation, Rotary).

**Select an operational focus or ask anything below:**
- **Field Ops:** Clinic stocks in Tsarang & Tsonup, high-altitude AMS emergency descent, volunteer acclimatization itineraries.
- **Expedition Navigator:** Real-time Google Maps grounded routing, travel times, helipads, and referral hospitals (powered by **gemini-3.5-flash**).
- **Cultural Codex:** Sowa-Rigpa herbal formulas (*Agar-35, Semde*), Three Humors balance, and instant English/Nepali/Tibetan medical translations.
- **Impact Engine:** Converting raw field tallies into executive reports for Rotary/JJoy Foundation and personalized donor receipts.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.8-flash',
      suggestedActions: [
        'Check Tsonup clinic winter supply alerts',
        'Emergency descent protocol for Lake Louise Score > 6',
        'Nearest emergency hospital in Pokhara/Kathmandu from Tsarang',
        'How does Sowa-Rigpa treat high-altitude rLung?',
        'Draft JJoy Foundation 4-day dental camp update'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await askAgent(query, role, { 
        lowBandwidthMode, 
        useMapsGrounding: useMapsGrounding || role === 'route_intel' 
      });
      
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        role: response.role || role,
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source as any,
        groundingMetadata: response.groundingMetadata,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const rolePills: { id: AgentRole; label: string; icon: any; desc: string; color: string }[] = [
    {
      id: 'general',
      label: 'All-in-One Co-Pilot',
      icon: Compass,
      desc: 'Holistic support across logistics, codex & impact',
      color: 'bg-amber-600 text-white'
    },
    {
      id: 'route_intel',
      label: 'Expedition Navigator',
      icon: MapPin,
      desc: 'Google Maps grounded routes, road status & hospitals (gemini-3.5-flash)',
      color: 'bg-sky-600 text-white'
    },
    {
      id: 'field_ops',
      label: 'Field Ops & Logistics',
      icon: ShieldAlert,
      desc: 'Triage, emergency descent, clinic inventory, travel routes',
      color: 'bg-emerald-600 text-white'
    },
    {
      id: 'cultural_codex',
      label: 'Sowa-Rigpa Scholar',
      icon: BookOpen,
      desc: 'Traditional Tibetan medicine, humors, tri-lingual translations',
      color: 'bg-indigo-600 text-white'
    },
    {
      id: 'impact_engine',
      label: 'Impact & Donor Officer',
      icon: HeartHandshake,
      desc: 'Rotary & JJoy grant reporting, donor gratitude receipts',
      color: 'bg-rose-600 text-white'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Role Switcher */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold font-cinzel text-amber-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              HGO Multi-Agent Command Console
            </h2>
            <p className="text-xs text-stone-400">
              Direct consultation with AI specialized in Himalayan field operations, Sorig traditional medicine, and partner communications.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800 border border-stone-700 text-stone-300">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              Engine: <strong className="text-amber-300">Gemini 3.8 Flash</strong>
            </span>
            {lowBandwidthMode && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                Low-Bandwidth Satellite Mode
              </span>
            )}
          </div>
        </div>

        {/* Role Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {rolePills.map((p) => {
            const Icon = p.icon;
            const isSelected = role === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setRole(p.id)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-stone-800 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-800/50 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-800 text-stone-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-amber-200' : 'text-stone-300'}`}>
                    {p.label}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-tight">
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl flex flex-col h-[560px] shadow-inner overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-4xl ${isUser ? 'ml-auto' : 'mr-auto'}`}
              >
                {/* Meta details */}
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-stone-400">
                  <span className="font-medium">
                    {isUser ? 'You (Field Team)' : 'HGO-Agent Co-Pilot'}
                  </span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                  {m.source && (
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono flex items-center gap-1 ${
                      m.source.includes('Google Maps')
                        ? 'bg-sky-950/80 text-sky-300 border-sky-800'
                        : 'bg-stone-800 text-amber-300/80 border-stone-700'
                    }`}>
                      {m.source.includes('Google Maps') && <MapPin className="w-2.5 h-2.5 text-sky-400" />}
                      <span>{m.source}</span>
                    </span>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`relative p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-600 text-stone-50 rounded-br-none shadow-md'
                      : 'bg-stone-800/90 text-stone-200 border border-stone-700/80 rounded-bl-none shadow-md backdrop-blur-sm'
                  }`}
                >
                  {/* Content rendering */}
                  <div className="prose prose-invert prose-xs sm:prose-sm max-w-none whitespace-pre-wrap">
                    {m.text}
                  </div>

                  {/* Actions for Agent responses */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-stone-700/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(m.id, m.text)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-stone-900/70 hover:bg-stone-900 text-stone-300 transition-colors border border-stone-700"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-stone-400" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Quick contextual cross-links */}
                      {m.text.toLowerCase().includes('triage') && (
                        <button
                          onClick={() => onNavigateToTab('triage')}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50"
                        >
                          <Stethoscope className="w-3 h-3" />
                          <span>Open Triage Module</span>
                          <ArrowRight className="w-3 h-3 ml-0.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Suggested Quick Followups */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-700/60 space-y-1.5">
                      <p className="text-[11px] font-semibold text-amber-300/80">Suggested Actions:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(action)}
                            className="px-2.5 py-1 text-[11px] rounded-lg bg-stone-900/80 hover:bg-amber-950/70 text-amber-200 border border-stone-700 hover:border-amber-500/50 transition-all text-left"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-stone-400 text-xs p-3 rounded-xl bg-stone-800/50 border border-stone-700 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>HGO-Agent synthesizing Himalayan field knowledge & guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-stone-950/90 border-t border-stone-800 space-y-2.5">
          {/* Grounding Mode Indicator & Switch */}
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseMapsGrounding(!useMapsGrounding)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${
                  useMapsGrounding || role === 'route_intel'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-300'
                }`}
                title="Ground responses with Google Maps data using gemini-3.5-flash"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Google Maps Grounding</span>
                <span className={`w-2 h-2 rounded-full ${useMapsGrounding || role === 'route_intel' ? 'bg-sky-400 animate-pulse' : 'bg-stone-600'}`} />
              </button>
              {(useMapsGrounding || role === 'route_intel') && (
                <span className="text-[10px] text-sky-400 font-mono hidden sm:inline">
                  gemini-3.5-flash with googleMaps tool
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('maps_grounding')}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
            >
              <span>Expedition Maps Hub</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                role === 'field_ops'
                  ? 'Ask about clinic stock alerts, Lake Louise triage, or road pass closures...'
                  : role === 'cultural_codex'
                  ? 'Ask about Sowa-Rigpa herbs (Agar-35, Semde), humors, or translation...'
                  : role === 'impact_engine'
                  ? 'Enter raw notes to format a Rotary/JJoy report or donor thank-you...'
                  : 'Ask HGO-Agent anything regarding Himalayan operations, Sowa-Rigpa, or donors...'
              }
              className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-md shadow-amber-900/30"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Starter Chips */}
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px] text-stone-400">
            <span className="font-semibold text-stone-500 whitespace-nowrap">Try:</span>
            <button
              onClick={() => handleSend("What is the acute descent protocol if SpO2 drops below 75% at Tsarang (3,560m)?")}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 whitespace-nowrap"
            >
              Emergency SpO2 &lt;75% protocol
            </button>
            <button
              onClick={() => handleSend("Explain Agar-35 humoral indication and how to prepare it in high-altitude dry climate.")}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 whitespace-nowrap"
            >
              Agar-35 &amp; rLung guide
            </button>
            <button
              onClick={() => handleSend("Translate into Nepali and Tibetan: 'Take this antibiotic after meals with warm water for 5 days.'")}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 whitespace-nowrap"
            >
              Antibiotic dosage translation
            </button>
            <button
              onClick={() => handleSend("Format raw notes: 'Tsarang camp Day 2: 110 patients, 42 dental fillings, 18 extractions, 34 eye glasses distributed. Partner JJoy Foundation.'")}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 whitespace-nowrap"
            >
              Draft JJoy Foundation report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
