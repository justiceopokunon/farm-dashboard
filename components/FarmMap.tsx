
import React from 'react';
import { HardwareNode } from '../types';
import { AlertCircle, CheckCircle2, MapPin } from 'lucide-react';

interface FarmMapProps {
  hardware: HardwareNode[];
}

const FarmMap: React.FC<FarmMapProps> = ({ hardware }) => {
  // Mock layout positions for the nodes
  const nodesWithPos = [
    { ...hardware[0], x: 25, y: 30 }, // Greenhouse Alpha
    { ...hardware[1], x: 50, y: 50 }, // Main Gateway
    { ...hardware[2], x: 75, y: 25 }, // Drip Pump
    { ...hardware[3], x: 20, y: 70 }, // West Orchard
  ];

  return (
    <div className="relative w-full aspect-[2/1] bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden group">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#10B981 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Visual representation of farm zones */}
      <div className="absolute top-4 left-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Zone Spatial Topology</div>

      {/* Nodes on map */}
      {nodesWithPos.map((node) => (
        <div 
          key={node.id} 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group/node cursor-pointer"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {/* Node Aura */}
          <div className={`absolute inset-0 w-12 h-12 -m-4 rounded-full blur-xl transition-all duration-700 ${
            node.status === 'online' ? 'bg-[#10B981]/10 group-hover/node:bg-[#10B981]/20' : 
            node.status === 'warning' ? 'bg-[#F59E0B]/20 animate-pulse' : 'bg-[#DC2626]/10'
          }`}></div>

          {/* Node Icon */}
          <div className={`relative p-2 rounded-xl border-2 bg-white shadow-lg transition-all ${
            node.status === 'online' ? 'border-[#10B981] text-[#10B981] scale-100 group-hover/node:scale-110' : 
            node.status === 'warning' ? 'border-[#F59E0B] text-[#F59E0B] scale-110 animate-bounce' : 'border-[#E2E8F0] text-[#94A3B8] grayscale opacity-50'
          }`}>
            <MapPin size={20} />
          </div>

          {/* Node Label Popup */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
            <div className="bg-[#0F172A] text-white text-[10px] px-2 py-1 rounded-md font-bold shadow-xl border border-white/10">
              {node.name}
            </div>
          </div>
        </div>
      ))}

      {/* Connection Lines (Simulated Pathing) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
        <path d="M 50 50 L 25 30" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 50 50 L 75 25" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 50 50 L 20 70" stroke="#DC2626" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      
      <div className="absolute bottom-4 right-4 flex gap-4 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
          <span className="text-[10px] font-bold text-[#64748B]">MESH_OK</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
          <span className="text-[10px] font-bold text-[#64748B]">LATENCY_WARN</span>
        </div>
      </div>
    </div>
  );
};

export default FarmMap;
