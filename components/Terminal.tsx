
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, Square, Trash2 } from 'lucide-react';

interface TerminalLine {
  id: number;
  type: 'in' | 'out' | 'system';
  content: string;
  timestamp: string;
}

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const messages = [
      { type: 'in', content: 'RECV [Node-01]: {"temp": 24.8, "hum": 48.2, "status": "OK"}' },
      { type: 'in', content: 'RECV [Node-02]: {"soil_ph": 7.2, "v_bat": 3.72}' },
      { type: 'system', content: '>>> Heartbeat acknowledged by ws://localhost:8000' },
      { type: 'out', content: 'SEND [Node-03]: CMD_SET_VALVE_ON' },
      { type: 'system', content: '>>> AI Model inference: Disease Probability 0.02% [Healthy]' },
      { type: 'in', content: 'RECV [Node-03]: ACK_CMD_04' },
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const newLine: TerminalLine = {
        id: Date.now(),
        type: msg.type as any,
        content: msg.content,
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setLines(prev => [...prev.slice(-49), newLine]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const clearTerminal = () => setLines([]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Raw System Terminal</h2>
          <p className="text-[#64748B] mt-1">Live WebSocket stream from local development environment.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isPaused ? 'bg-[#10B981] text-white' : 'bg-white border border-[#E2E8F0] text-[#64748B]'
            }`}
          >
            {isPaused ? <Play size={16} /> : <Square size={16} />}
            {isPaused ? 'Resume' : 'Pause Stream'}
          </button>
          <button 
            onClick={clearTerminal}
            className="p-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:text-red-500 hover:border-red-200 transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0F172A] rounded-2xl border border-[#334155] p-6 shadow-2xl font-mono text-sm overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b border-[#1E293B] pb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
          </div>
          <span className="text-[#94A3B8] ml-2 text-xs">root@agro-dev: ~/ws-stream</span>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 custom-terminal-scrollbar">
          {lines.length === 0 && (
            <p className="text-[#334155]">_ No active data packets...</p>
          )}
          {lines.map((line) => (
            <div key={line.id} className="flex gap-4">
              <span className="text-[#475569] shrink-0">[{line.timestamp}]</span>
              <span className={`
                ${line.type === 'in' ? 'text-[#10B981]' : ''}
                ${line.type === 'out' ? 'text-[#0EA5E9]' : ''}
                ${line.type === 'system' ? 'text-[#F59E0B]' : ''}
              `}>
                {line.content}
              </span>
            </div>
          ))}
          {!isPaused && (
            <div className="flex gap-2">
              <span className="text-[#475569]">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <span className="text-[#10B981] animate-pulse">_</span>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .custom-terminal-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-terminal-scrollbar::-webkit-scrollbar-track {
          background: #0F172A;
        }
        .custom-terminal-scrollbar::-webkit-scrollbar-thumb {
          background: #1E293B;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default Terminal;
