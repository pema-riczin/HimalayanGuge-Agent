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
I am the digital co-pilot for the **Himalayan Guge Organization (HGO)**, bridging remote Himalayan field teams, traditional Sowa-Rigpa knowledge keepers, and our international partner network (JJoy Foundation, Rotary, local clinics, and monastic communities).

**Select an operational focus or ask anything below:**
- **Field Ops:** Clinic stocks in Tsarang & Tsonup, high-altitude AMS emergency descent, volunteer acclimatization itineraries.
- **Expedition Navigator:** Google Maps grounded routing, travel times, helipads, and referral hospitals.
- **Cultural Codex:** Sowa-Rigpa herbal formulas, Three Humors balance, instant English/Nepali/Tibetan translations.
- **Impact Engine:** Converting raw field tallies into executive reports for Rotary/JJoy Foundation and donor acknowledgments.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.8-flash',
      suggestedActions: [
        'Check Tsonup clinic winter supply alerts',
        'Emergency descent protocol for Lake Louise Score > 6',
        'Nearest emergency hospital in Pokhara/Kathmandu from Tsarang',
        'How does Sowa-Rigpa treat high-altitude rLung?',
        'Draft JJoy Foundation 4-day dental camp update',
      ],
    },
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
        useMapsGrounding: useMapsGrounding || role === 'route_intel',
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

  const rolePills: { id: AgentRole; label: string; icon: any; desc: string }[] = [
    {
      id: 'general',
      label: 'All-in-One Co-Pilot',
      icon: Compass,
      desc: 'Holistic support across logistics, codex & impact',
    },
    {
      id: 'route_intel',
      label: 'Expedition Navigator',
      icon: MapPin,
      desc: 'Google Maps grounded routes, road status & hospitals',
    },
    {
      id: 'field_ops',
      label: 'Field Ops & Logistics',
      icon: ShieldAlert,
      desc: 'Triage, emergency descent, clinic inventory, travel routes',
    },
    {
      id: 'cultural_codex',
      label: 'Sowa-Rigpa Scholar',
      icon: BookOpen,
      desc: 'Traditional Tibetan medicine, humors, translations',
    },
    {
      id: 'impact_engine',
      label: 'Impact & Donor Officer',
      icon: HeartHandshake,
      desc: 'Rotary & JJoy grant reporting, donor receipts',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="rounded-[28px] border border-outline-variant bg-[color:var(--md-sys-color-surface-container)] p-5 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 flex items-center gap-2 font-cinzel text-xl font-bold text-on-surface">
              <Sparkles className="h-5 w-5 text-primary" />
              HGO Multi-Agent Command Console
            </h2>
            <p className="text-xs text-on-surface-variant">
              Direct consultation with AI specialized in Himalayan field operations, Sorig traditional medicine, and partner communications.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-outline bg-surface px-2.5 py-1 text-on-surface-variant">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              Engine: <strong className="text-primary">Gemini 3.8 Flash</strong>
            </span>
            {lowBandwidthMode && (
              <span className="rounded-full border border-primary/25 bg-primary-container px-2 py-0.5 text-[10px] font-medium text-on-primary-container">
                Low-Bandwidth Satellite Mode
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {rolePills.map((p) => {
            const Icon = p.icon;
            const isSelected = role === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setRole(p.id)}
                className={`flex min-h-[110px] flex-col justify-between rounded-2xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-primary bg-primary-container text-on-primary-container shadow-sm'
                    : 'border-outline-variant bg-surface text-on-surface hover:bg-surface-container'
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className={`rounded-xl p-1.5 ${isSelected ? 'bg-white/15 text-current' : 'bg-surface-container text-on-surface-variant'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold">{p.label}</span>
                </div>
                <p className={`text-[11px] leading-tight ${isSelected ? 'text-on-primary-container/90' : 'text-on-surface-variant'}`}>
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-[560px] flex-col overflow-hidden rounded-[28px] border border-outline-variant bg-[color:var(--md-sys-color-surface)] shadow-sm">
        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex max-w-4xl flex-col ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className="mb-1 flex items-center gap-2 px-1 text-[11px] text-on-surface-variant">
                  <span className="font-medium">{isUser ? 'You (Field Team)' : 'HGO-Agent Co-Pilot'}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                  {m.source && (
                    <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono ${
                      m.source.includes('Google Maps')
                        ? 'border-primary/30 bg-primary-container text-primary'
                        : 'border-outline bg-surface-container text-on-surface-variant'
                    }`}>
                      {m.source.includes('Google Maps') && <MapPin className="h-2.5 w-2.5" />}
                      <span>{m.source}</span>
                    </span>
                  )}
                </div>

                <div
                  className={`relative rounded-[24px] p-4 text-xs leading-relaxed shadow-sm sm:p-5 sm:text-sm ${
                    isUser
                      ? 'rounded-br-md bg-primary text-on-primary'
                      : 'rounded-bl-md border border-outline-variant bg-[color:var(--md-sys-color-surface-container)] text-on-surface'
                  }`}
                >
                  <div className="prose prose-xs max-w-none whitespace-pre-wrap sm:prose-sm prose-headings:font-semibold prose-headings:text-current prose-a:text-primary prose-strong:text-current">
                    {m.text}
                  </div>

                  {!isUser && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/70 pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(m.id, m.text)}
                          className="inline-flex items-center gap-1 rounded-full border border-outline bg-surface px-2.5 py-1 text-[11px] text-on-surface transition-all hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 text-on-surface-variant" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>

                      {m.text.toLowerCase().includes('triage') && (
                        <button
                          onClick={() => onNavigateToTab('triage')}
                          className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] text-rose-700 transition-all hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          <Stethoscope className="h-3 w-3" />
                          <span>Open Triage Module</span>
                          <ArrowRight className="ml-0.5 h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-outline-variant/70 pt-3">
                      <p className="text-[11px] font-semibold text-primary">Suggested Actions:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(action)}
                            className="rounded-full border border-outline-variant bg-surface px-2.5 py-1 text-[11px] text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-outline-variant bg-[color:var(--md-sys-color-surface-container)] p-3 text-xs text-on-surface-variant">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              <span>HGO-Agent synthesizing Himalayan field knowledge & guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="space-y-2.5 border-t border-outline-variant bg-[color:var(--md-sys-color-surface-container-low)] p-3 sm:p-4">
          <div className="flex items-center justify-between px-1 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseMapsGrounding(!useMapsGrounding)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                  useMapsGrounding || role === 'route_intel'
                    ? 'border-primary/30 bg-primary-container text-on-primary-container'
                    : 'border-outline bg-surface text-on-surface-variant hover:bg-surface-container'
                }`}
                title="Ground responses with Google Maps data using gemini-3.5-flash"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Google Maps Grounding</span>
                <span className={`h-2 w-2 rounded-full ${useMapsGrounding || role === 'route_intel' ? 'bg-emerald-500' : 'bg-outline'}`} />
              </button>
              {(useMapsGrounding || role === 'route_intel') && (
                <span className="hidden text-[10px] font-mono text-primary sm:inline">
                  gemini-3.5-flash with googleMaps tool
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('maps_grounding')}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80"
            >
              <span>Expedition Maps Hub</span>
              <ArrowRight className="h-3 w-3" />
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
                    ? 'Ask about Sowa-Rigpa herbs, humors, or translation...'
                    : role === 'impact_engine'
                      ? 'Enter raw notes to format a Rotary/JJoy report or donor thank-you...'
                      : 'Ask HGO-Agent anything regarding Himalayan operations, Sowa-Rigpa, or donors...'
              }
              className="flex-1 rounded-2xl border border-outline bg-surface px-4 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-xs font-medium text-on-primary shadow-sm transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto text-[11px] text-on-surface-variant">
            <span className="whitespace-nowrap font-semibold text-on-surface-variant">Try:</span>
            <button
              onClick={() => handleSend('What is the acute descent protocol if SpO2 drops below 75% at Tsarang (3,560m)?')}
              className="whitespace-nowrap rounded-full border border-outline bg-surface px-2 py-1 hover:bg-surface-container"
            >
              Emergency SpO2 &lt;75% protocol
            </button>
            <button
              onClick={() => handleSend('Explain Agar-35 humoral indication and how to prepare it in high-altitude dry climate.')}
              className="whitespace-nowrap rounded-full border border-outline bg-surface px-2 py-1 hover:bg-surface-container"
            >
              Agar-35 &amp; rLung guide
            </button>
            <button
              onClick={() => handleSend("Translate into Nepali and Tibetan: 'Take this antibiotic after meals with warm water for 5 days.'")}
              className="whitespace-nowrap rounded-full border border-outline bg-surface px-2 py-1 hover:bg-surface-container"
            >
              Antibiotic dosage translation
            </button>
            <button
              onClick={() => handleSend("Format raw notes: 'Tsarang camp Day 2: 110 patients, 42 dental fillings, 18 extractions, 34 eye glasses distributed. Partner JJoy Foundation.'")}
              className="whitespace-nowrap rounded-full border border-outline bg-surface px-2 py-1 hover:bg-surface-container"
            >
              Draft JJoy Foundation report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};







































































































































"""































































































\n
"""