
import React from 'react';
import { Terminal, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { LogEntry } from '../types';

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '2023-11-20 14:32:01', level: 'success', message: 'AI Inference completed: Zone 4 Clear', source: 'Core-AI-Worker' },
  { id: '2', timestamp: '2023-11-20 14:30:45', level: 'info', message: 'Auto-irrigation triggered: North Sector B', source: 'Flow-Control' },
  { id: '3', timestamp: '2023-11-20 14:28:12', level: 'warning', message: 'Low battery detected on West Orchard Node', source: 'Fleet-Manager' },
  { id: '4', timestamp: '2023-11-20 14:25:55', level: 'error', message: 'MQTT Connection timeout on subnet 192.168.1.x', source: 'Gateway' },
  { id: '5', timestamp: '2023-11-20 14:20:00', level: 'info', message: 'Scheduled data snapshot synchronized to cloud', source: 'Data-Archiver' },
  { id: '6', timestamp: '2023-11-20 14:15:22', level: 'success', message: 'System heartbeat verified: All systems nominal', source: 'System-Monitor' },
];

interface LogsProps {
  searchQuery?: string;
}

const Logs: React.FC<LogsProps> = ({ searchQuery = '' }) => {
  const filteredLogs = MOCK_LOGS.filter(log => 
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">System Events</h2>
          <p className="text-[#64748B] mt-1">Diagnostic logs and audit trail for automated operations.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm font-semibold hover:bg-slate-50">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm font-semibold hover:bg-slate-50">
            <Download size={18} />
            Download CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] card-radius soft-shadow">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]/50 flex items-center gap-3">
          <Terminal size={18} className="text-[#10B981]" />
          <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Live Log Terminal</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Event Message</th>
                <th className="px-8 py-4 text-right">Service Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-8 py-4">
                      <span className="text-xs font-mono text-[#64748B]">{log.timestamp}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        log.level === 'success' ? 'text-[#16A34A] bg-[#DCFCE7]' :
                        log.level === 'warning' ? 'text-[#F59E0B] bg-[#FEF3C7]' :
                        log.level === 'error' ? 'text-[#DC2626] bg-[#FEE2E2]' :
                        'text-[#2563EB] bg-[#DBEAFE]'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-sm font-medium text-[#0F172A]">{log.message}</p>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="px-3 py-1 bg-[#F1F5F9] rounded-lg text-[10px] font-bold text-[#64748B] tracking-tight">{log.source}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-[#64748B] text-sm font-medium">
                    No logs matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-xs text-[#94A3B8]">Showing {filteredLogs.length} of {MOCK_LOGS.length} entries</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-[#94A3B8] hover:bg-[#F1F5F9] rounded-lg transition-all disabled:opacity-30">
              <ChevronLeft size={20} />
            </button>
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                p === 1 ? 'bg-[#10B981] text-white' : 'text-[#64748B] hover:bg-[#F1F5F9]'
              }`}>
                {p}
              </button>
            ))}
            <button className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
