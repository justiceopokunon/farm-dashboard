
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, Loader2, Maximize2 } from 'lucide-react';
import { ChatMessage, SensorData, HardwareNode } from '../types';
import { chatWithAI } from '../services/geminiService';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  systemContext: { sensors: SensorData[], hardware: HardwareNode[], controls: any };
  onToggleControl: (key: string, val?: any) => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, systemContext, onToggleControl }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your Agricultural AI Assistant. I have full visibility into your greenhouse telemetry and can execute hardware commands. What would you like to optimize?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await chatWithAI(userMsg, messages, systemContext);
    
    if (response) {
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === 'toggleIrrigation') {
            onToggleControl('irrigation', call.args.state);
            setMessages(prev => [...prev, { role: 'model', text: `CMD_ACK: Irrigation system ${call.args.state ? 'ACTIVATED' : 'DEACTIVATED'}.` }]);
          } else if (call.name === 'toggleVentilation') {
            onToggleControl('ventilation', call.args.state);
            setMessages(prev => [...prev, { role: 'model', text: `CMD_ACK: Ventilation array set to ${call.args.state ? 'ACTIVE' : 'IDLE'}.` }]);
          } else if (call.name === 'setLights') {
            onToggleControl('lights', call.args.brightness);
            setMessages(prev => [...prev, { role: 'model', text: `CMD_ACK: Photosynthetic intensity adjusted to ${call.args.brightness}%.` }]);
          }
        }
      } else if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }
    } else {
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not process request. Gateway timeout." }]);
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div 
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm pointer-events-auto transition-opacity duration-500 animate-in fade-in"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl pointer-events-auto flex flex-col border-l border-[#E2E8F0] animate-in slide-in-from-right duration-500 ease-in-out">
        <div className="p-7 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#10B981] rounded-2xl text-white shadow-lg shadow-[#10B981]/20">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0F172A]">AI Agent</h2>
              <p className="text-[10px] text-[#10B981] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                Interface Active
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-[#94A3B8] hover:bg-[#E2E8F0] rounded-xl transition-all">
              <Maximize2 size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#0F172A] rounded-xl transition-all active:scale-90">
              <X size={26} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-7 space-y-8 bg-white custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 animate-fade-in-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`} style={{ animationDelay: '0.1s' }}>
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-sm ${
                msg.role === 'user' ? 'bg-[#F1F5F9] text-[#64748B]' : 'bg-[#F0FDF4] text-[#10B981]'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed font-medium ${
                msg.role === 'user' 
                  ? 'bg-[#10B981] text-white rounded-tr-none shadow-lg shadow-[#10B981]/10' 
                  : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-[#F0FDF4] text-[#10B981] flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="p-5 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] rounded-tl-none">
                <Loader2 size={18} className="animate-spin text-[#10B981]" />
              </div>
            </div>
          )}
        </div>

        <div className="p-7 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Request optimization or hardware query..."
              rows={2}
              className="w-full pl-6 pr-14 py-4 bg-white border border-[#E2E8F0] rounded-3xl text-sm outline-none focus:ring-4 focus:ring-[#10B981]/5 focus:border-[#10B981] transition-all resize-none shadow-sm group-hover:border-[#10B981]/30"
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading} 
              className="absolute right-3 bottom-4 p-3 bg-[#10B981] text-white rounded-2xl hover:bg-[#059669] disabled:opacity-30 disabled:hover:bg-[#10B981] transition-all shadow-xl shadow-[#10B981]/20 active:scale-90"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-[10px] text-[#94A3B8] mt-4 font-bold uppercase tracking-widest">
            Hardware interface connected via local mesh
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
