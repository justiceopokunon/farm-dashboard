
import React, { useState } from 'react';
import { Cpu, Battery, Wifi, Activity, Power, RefreshCcw, MoreVertical, Shield, AlertCircle } from 'lucide-react';
import { HardwareNode } from '../types';

interface HardwareStatusProps {
  searchQuery?: string;
  hardware: HardwareNode[];
  setHardware: React.Dispatch<React.SetStateAction<HardwareNode[]>>;
}

const HardwareStatus: React.FC<HardwareStatusProps> = ({ searchQuery = '', hardware, setHardware }) => {
  const filteredNodes = hardware.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.ip.includes(searchQuery)
  );

  const handleRestartNode = (id: string) => {
    console.log(`Soft rebooting node: ${id}`);
    // Simulate a brief offline state
  };

  const handleToggleNodePower = (id: string) => {
    setHardware(prev => prev.map(n => 
      n.id === id ? { ...n, status: n.status === 'offline' ? 'online' : 'offline' } : n
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Hardware Fleet</h2>
          <p className="text-[#64748B] mt-1">Management of distributed IoT nodes and localized edge-compute.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm font-semibold hover:text-[#10B981] transition-all flex items-center gap-2">
            <RefreshCcw size={18} /> Rescan Subnet
          </button>
          <button className="px-6 py-3 bg-[#DC2626] text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-200">
            <AlertCircle size={18} /> Kill Switch
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] card-radius soft-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="px-8 py-5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Node Identification</th>
                <th className="px-8 py-5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Device Type</th>
                <th className="px-8 py-5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Address</th>
                <th className="px-8 py-5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredNodes.map((node) => (
                <tr key={node.id} className="hover:bg-[#F8FAFC]/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] group-hover:bg-white transition-all">
                        <Cpu size={20} className="text-[#64748B]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{node.name}</p>
                        <p className="text-[11px] text-[#94A3B8]">NODE_ID: {node.id.padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-[#64748B]">{node.type}</td>
                  <td className="px-8 py-5 font-mono text-xs text-[#0F172A]">{node.ip}</td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                      node.status === 'online' ? 'bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'online' ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`}></div>
                      {node.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleRestartNode(node.id)} className="p-2 text-[#64748B] hover:bg-[#F0FDF4] hover:text-[#10B981] rounded-lg transition-all" title="Soft Reboot">
                        <RefreshCcw size={16} />
                      </button>
                      <button onClick={() => handleToggleNodePower(node.id)} className={`p-2 rounded-lg transition-all ${node.status === 'online' ? 'text-[#DC2626] hover:bg-[#FEF2F2]' : 'text-[#10B981] hover:bg-[#F0FDF4]'}`}>
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HardwareStatus;
