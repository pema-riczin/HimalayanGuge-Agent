import React, { useState } from 'react';
import { 
  Smartphone, 
  Send, 
  Wifi, 
  WifiOff, 
  BatteryMedium, 
  X, 
  CheckCheck, 
  Paperclip, 
  Sparkles,
  RefreshCw,
  Compass
} from 'lucide-react';
import { askAgent } from '../services/api.ts';

interface MobileFieldSimulatorProps {
  onClose: () => void;
}

interface MobileMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const MobileFieldSimulator: React.FC<MobileFieldSimulatorProps> = ({
  onClose,
}) => {
  const [channel, setChannel] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [messages, setMessages] = useState<MobileMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `🏔️ HGO Field Bot (Upper Mustang Gateway)\nConnection: Low-Bandwidth 2G/InReach\n\nQuick Commands:\n/triage - Rapid Lake Louise intake\n/stock - Clinic medicine balances\n/ams - Emergency descent parameters\n/translate - Medical phrasebook`,
      time: '11:40 AM'
    },
    {
      id: 'm2',
      sender: 'user',
      text: `/stock tsonup`,
      time: '11:42 AM'
    },
    {
      id: 'm3',
      sender: 'bot',
      text: `📦 Tsonup Clinic (3,850m) Stock Status:\n⚠️ Amoxicillin 625mg: 18 boxes (Min 40) - CRITICAL\n⚠️ Portable O2: 3 canisters (Min 8)\n✅ Diamox 250mg: 120 tabs\n✅ Agar-35: 8 bottles\n\nTo request emergency dispatch, type /restock`,
      time: '11:42 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const newMsg: MobileMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await askAgent(text, 'field_ops', { lowBandwidthMode: true });
      const botMsg: MobileMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.reply.replace(/###/g, '').replace(/\*\*/g, ''),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col h-[700px] max-h-[92vh]">
        {/* Top Hardware Bezel */}
        <div className="bg-stone-950 px-4 py-2 flex items-center justify-between text-stone-400 text-[11px] border-b border-stone-800">
          <div className="flex items-center gap-1.5 font-mono">
            <span>2G InReach</span>
            <Wifi className="w-3 h-3 text-amber-400" />
          </div>
          <div className="w-20 h-4 bg-stone-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span>68%</span>
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
            <button
              onClick={onClose}
              className="ml-2 text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* App Header (WhatsApp / Telegram Switcher) */}
        <div
          className={`px-4 py-3 text-white flex items-center justify-between ${
            channel === 'whatsapp' ? 'bg-emerald-800' : 'bg-sky-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
              HGO
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">HGO Field Satellite Bot</div>
              <div className="text-[10px] opacity-80">Upper Mustang Sector • Online</div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg text-[10px]">
            <button
              onClick={() => setChannel('whatsapp')}
              className={`px-2 py-0.5 rounded ${channel === 'whatsapp' ? 'bg-white text-emerald-900 font-bold' : 'text-white'}`}
            >
              WA
            </button>
            <button
              onClick={() => setChannel('telegram')}
              className={`px-2 py-0.5 rounded ${channel === 'telegram' ? 'bg-white text-sky-900 font-bold' : 'text-white'}`}
            >
              TG
            </button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 bg-stone-950 p-3 space-y-3 overflow-y-auto text-xs font-sans">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow text-xs whitespace-pre-wrap ${
                    isUser
                      ? channel === 'whatsapp'
                        ? 'bg-emerald-700 text-white rounded-tr-none'
                        : 'bg-sky-700 text-white rounded-tr-none'
                      : 'bg-stone-800 text-stone-200 border border-stone-700 rounded-tl-none'
                  }`}
                >
                  {m.text}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                    <span>{m.time}</span>
                    {isUser && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="p-2 bg-stone-800 rounded-xl text-stone-400 text-[11px] w-fit flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
              <span>Transmitting over high-altitude gateway...</span>
            </div>
          )}
        </div>

        {/* Quick Slash Commands Chips */}
        <div className="bg-stone-900 px-3 py-1.5 border-t border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
          <button
            onClick={() => handleSend('/triage')}
            className="px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-stone-700 whitespace-nowrap"
          >
            /triage
          </button>
          <button
            onClick={() => handleSend('/ams')}
            className="px-2 py-0.5 rounded bg-stone-800 text-sky-300 border border-stone-700 whitespace-nowrap"
          >
            /ams
          </button>
          <button
            onClick={() => handleSend('/stock tsarang')}
            className="px-2 py-0.5 rounded bg-stone-800 text-emerald-300 border border-stone-700 whitespace-nowrap"
          >
            /stock
          </button>
          <button
            onClick={() => handleSend('/translate Take with warm water')}
            className="px-2 py-0.5 rounded bg-stone-800 text-purple-300 border border-stone-700 whitespace-nowrap"
          >
            /translate
          </button>
        </div>

        {/* Input */}
        <div className="bg-stone-900 p-2.5 border-t border-stone-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type field command or query..."
            className="flex-1 bg-stone-950 border border-stone-700 rounded-full px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2 rounded-full bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
