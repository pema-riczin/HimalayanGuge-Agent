import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Globe, 
  HeartHandshake, 
  Users, 
  BookOpen, 
  Check, 
  RefreshCw,
  Compass
} from 'lucide-react';
import { askAgent } from '../services/api.ts';

interface PublicWidgetModalProps {
  onClose: () => void;
  onOpenDonate: (amount: number, initiative: string) => void;
}

export const PublicWidgetModal: React.FC<PublicWidgetModalProps> = ({
  onClose,
  onOpenDonate,
}) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    {
      sender: 'bot',
      text: `Hello and Tashi Delek! 🙏\nI am the Himalayan Guge Organization (HGO) community concierge.\n\nAre you looking to:\n1. Volunteer as an international dentist or physician?\n2. Learn about Sowa-Rigpa (Traditional Himalayan Medicine)?\n3. Support ongoing restoration at Bigu Nunnery or Tsarang Gompa?\n\nFeel free to ask any question below!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await askAgent(text, 'impact_engine');
      setMessages((prev) => [...prev, { sender: 'bot', text: res.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        {/* Header Preview simulating himalayanguge.org embed */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-5 py-4 border-b border-amber-900/40 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center shadow">
              <Compass className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="font-cinzel font-bold text-sm leading-tight flex items-center gap-1.5">
                <span>Himalayan Guge Org</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans">
                  Official Widget
                </span>
              </div>
              <div className="text-[11px] text-stone-400">
                Embedded on himalayanguge.org
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick public shortcuts */}
        <div className="bg-stone-950 px-4 py-2 border-b border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
          <button
            onClick={() => handleSend("How can a volunteer dentist or eye doctor apply for the 2026 Mustang camp?")}
            className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 whitespace-nowrap flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            <span>Volunteer Sign-up</span>
          </button>
          <button
            onClick={() => handleSend("What is Sowa-Rigpa traditional Tibetan medicine?")}
            className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-sky-300 border border-stone-800 whitespace-nowrap flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>What is Sowa-Rigpa?</span>
          </button>
          <button
            onClick={() => handleSend("How are donations used for Bigu Nunnery and Tsarang clinic?")}
            className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-emerald-300 border border-stone-800 whitespace-nowrap flex items-center gap-1"
          >
            <HeartHandshake className="w-3 h-3" />
            <span>Donor Transparency</span>
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 bg-stone-950 p-4 space-y-4 overflow-y-auto text-xs font-sans">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-md leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-amber-600 text-white rounded-br-none'
                      : 'bg-stone-850 text-stone-200 border border-stone-700/80 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="p-3 bg-stone-800 rounded-xl text-stone-400 text-xs w-fit flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>HGO Concierge is preparing your answer...</span>
            </div>
          )}
        </div>

        {/* Action Bar & Input */}
        <div className="bg-stone-900 p-3 border-t border-stone-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about our healthcare missions, volunteering, or donating..."
            className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50 transition-colors shadow-md shadow-amber-900/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
